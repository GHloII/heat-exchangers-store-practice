// Heat Exchangers Store - Main JavaScript File

// Класс для товара
/*
class Product {
    constructor(id, name, price, image, manufacturer = '', pressure = 0, diameter = 0, temperature = 0, description = '') {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.manufacturer = manufacturer;
        this.pressure = pressure;
        this.diameter = diameter;
        this.temperature = temperature;
        this.description = description;
    }

    static fromElement(card) {
        const id = card.dataset.id || card.dataset.productId || Math.random().toString(36).substr(2, 9);
        const name = card.querySelector('h2, h3')?.textContent || '';
        const priceText = card.querySelector('.product-price, .product-card-large-price')?.textContent || '';
        const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
        const image = card.querySelector('img')?.src || '';
        const description = card.querySelector('.product-description')?.textContent.trim() || card.dataset.description || '';
        
        return new Product(id, name, price, image, '', 0, 0, 0, description);
    }
}
*/

// Класс для работы с корзиной в localStorage
class Cart {
    static storageKey = 'cart_items';

    static getItems() {
        const items = localStorage.getItem(Cart.storageKey);
        return items ? JSON.parse(items) : [];
    }

    static saveItems(items) {
        localStorage.setItem(Cart.storageKey, JSON.stringify(items));
    }

    static addItem(product) {
        const items = Cart.getItems();
        const idx = items.findIndex(i => String(i.id) === String(product.id));
        if (idx !== -1) {
            items[idx].qty += 1;
        } else {
            items.push({ ...product, qty: 1 });
        }
        Cart.saveItems(items);
    }

    static removeItem(id) {
        let items = Cart.getItems();
        items = items.filter(i => String(i.id) !== String(id));
        Cart.saveItems(items);
    }

    static updateQty(id, qty) {
        const items = Cart.getItems();
        const idx = items.findIndex(i => String(i.id) === String(id));
        if (idx !== -1) {
            items[idx].qty = qty;
            if (items[idx].qty < 1) {
                // Если количество меньше 1, удаляем товар
                Cart.removeItem(id);
                return; // Выходим, чтобы не сохранять дважды
            }
        }
        Cart.saveItems(items);
    }

    static clear() {
        localStorage.removeItem(Cart.storageKey);
    }

    static getTotalItems() {
        return Cart.getItems().reduce((total, item) => total + item.qty, 0);
    }

    static getItemQty(productId) {
        const items = Cart.getItems();
        const item = items.find(i => String(i.id) === String(productId));
        return item ? item.qty : 0;
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Heat Exchangers Store application loaded');
    
    // Инициализация приложения
    await initApp();

    // Инициализация поиска
    initSearch();

    // Модальное окно авторизации/регистрации
    const profileBtn = document.querySelector('.profile-btn');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('modalRegisterForm');

    // Открытие модального окна (только для неавторизованных пользователей)
    if (profileBtn && authModal && !AuthAPI.isAuthenticated()) {
        profileBtn.addEventListener('click', function() {
            authModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    // Закрытие модального окна
    if (closeAuthModal && authModal) {
        closeAuthModal.addEventListener('click', function() {
            authModal.style.display = 'none';
            document.body.style.overflow = '';
            clearAuthForms();
        });
        // Закрытие по клику вне модального окна
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                authModal.style.display = 'none';
                document.body.style.overflow = '';
                clearAuthForms();
            }
        });
    }
    // Переключение вкладок
    if (loginTab && registerTab && loginForm && registerForm) {
        loginTab.addEventListener('click', function() {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.style.display = '';
            registerForm.style.display = 'none';
            clearAuthForms();
        });
        registerTab.addEventListener('click', function() {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            loginForm.style.display = 'none';
            registerForm.style.display = '';
            clearAuthForms();
        });
    }
    // Валидация и вход
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearAuthForms();
            const email = loginForm.loginEmail.value.trim();
            const password = loginForm.loginPassword.value;
            let valid = true;
            if (!validateEmail(email)) {
                showError(loginForm.loginEmail, 'Некорректный email');
                valid = false;
            }
            if (password.length < 6) {
                showError(loginForm.loginPassword, 'Пароль должен быть не менее 6 символов');
                valid = false;
            }
            if (valid) {
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                try {
                    // Показываем индикатор загрузки
                    submitBtn.textContent = 'Вход...';
                    submitBtn.disabled = true;

                    const response = await AuthAPI.signin({ email, password });
                    
                    // Сохраняем токен и информацию о пользователе
                    AuthAPI.saveToken(response.jwt);
                    if (response.user) {
                        AuthAPI.saveUserInfo(response.user);
                        console.log('Информация о пользователе сохранена:', response.user);
                    }
                    
                    alert('Вход выполнен успешно!');
                    authModal.style.display = 'none';
                    document.body.style.overflow = '';
                    loginForm.reset();
                    window.location.href = 'profile.html';
                } catch (error) {
                    alert('Ошибка входа: ' + error.message);
                } finally {
                    // Восстанавливаем кнопку
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
    // Валидация и регистрация
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearAuthForms();
            const name = registerForm.regName.value.trim();
            const email = registerForm.regEmail.value.trim();
            const password = registerForm.regPassword.value;
            const confirmPassword = registerForm.regConfirmPassword.value;
            let valid = true;
            if (name.length < 2) {
                showError(registerForm.regName, 'Имя должно быть не менее 2 символов');
                valid = false;
            }
            if (!validateEmail(email)) {
                showError(registerForm.regEmail, 'Некорректный email');
                valid = false;
            }
            if (password.length < 6) {
                showError(registerForm.regPassword, 'Пароль должен быть не менее 6 символов');
                valid = false;
            }
            if (password !== confirmPassword) {
                showError(registerForm.regConfirmPassword, 'Пароли не совпадают');
                valid = false;
            }
            if (valid) {
                try {
                    // Показываем индикатор загрузки
                    const submitBtn = registerForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Регистрация...';
                    submitBtn.disabled = true;

                    const response = await AuthAPI.signup({ 
                        username: name, 
                        email, 
                        password 
                    });
                    
                    // Сохраняем токен и информацию о пользователе
                    AuthAPI.saveToken(response.jwt);
                    if (response.user) {
                        AuthAPI.saveUserInfo(response.user);
                        console.log('Информация о пользователе сохранена:', response.user);
                    }
                    
                    alert('Регистрация успешна!');
                    authModal.style.display = 'none';
                    document.body.style.overflow = '';
                    registerForm.reset();
                    window.location.href = 'profile.html';
                } catch (error) {
                    alert('Ошибка регистрации: ' + error.message);
                } finally {
                    // Восстанавливаем кнопку
                    const submitBtn = registerForm.querySelector('button[type="submit"]');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
    // Вспомогательные функции
    function showError(input, message) {
        input.classList.add('input-error');
        let error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        input.parentNode.insertBefore(error, input.nextSibling);
    }
    function clearAuthForms() {
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }
    function validateEmail(email) {
        return /^\S+@\S+\.\S+$/.test(email);
    }
    initAddToCartButtons();
    updateCartIndicator(); // Инициализируем индикатор корзины

    // --- обработка статических карточек товара ---
    const staticCards = document.querySelectorAll('.product-card');
    if (staticCards.length > 0) {
        const products = [];
        staticCards.forEach(card => {
            // Новый обработчик: только по фото и названию
            const img = card.querySelector('.product-image');
            if (img) {
                img.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const id = card.dataset.id;
                    if (id) {
                        window.location.href = `product-card.html?id=${id}`;
                    }
                });
            }
            const title = card.querySelector('h3');
            if (title) {
                title.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const id = card.dataset.id;
                    if (id) {
                        window.location.href = `product-card.html?id=${id}`;
                    }
                });
            }
            // Собираем данные о товаре из DOM
            const name = card.querySelector('h3')?.textContent || '';
            const priceText = card.querySelector('.product-price')?.textContent || '';
            const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
            const image = card.querySelector('img')?.src || '';
            // Парсим описание из скрытого блока, если есть, иначе из data-description
            let description = '';
            const descElem = card.querySelector('.product-description');
            if (descElem) {
                description = descElem.textContent.trim();
            } else {
                description = card.dataset.description || '';
            }
            products.push({ id: card.dataset.id, name, price, image, description });
        });
        window.products = products;
        localStorage.setItem('products', JSON.stringify(products));
    }
});

window.addEventListener('pageshow', function(event) {
    if (typeof updateCartIndicator === 'function') {
        updateCartIndicator();
    }
    console.log('pageshow: UI синхронизирован после возврата назад');
});

async function initApp() {
    // Основная логика приложения будет здесь
    console.log('=== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ===');
    // Обновляем UI в зависимости от авторизации
    console.log('Обновление UI авторизации...');
    updateAuthUI();
    // Мобильные фильтры
    console.log('Инициализация мобильных фильтров...');
    initMobileFilters();
    // Инициализация фильтров
    console.log('Инициализация фильтров...');
    initFilters();
    // Загружаем все товары при инициализации
    console.log('Загрузка товаров...');
    try {
        const products = await fetchAllProducts();
        console.log('[LOG] fetchAllProducts вернул:', products);
        window.products = products;
        localStorage.setItem('products', JSON.stringify(products));
        console.log('[LOG] Сохранил products в window и localStorage:', localStorage.getItem('products'));
        console.log('Товары успешно загружены, обновление отображения...');
        updateProductsDisplay(products);
        console.log('Приложение инициализировано успешно');
    } catch (error) {
        console.error('[LOG] Не удалось загрузить товары:', error);
        // Показываем сообщение пользователю
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <h3>Ошибка загрузки товаров</h3>
                    <p>Не удалось загрузить товары с сервера. Пожалуйста, попробуйте обновить страницу.</p>
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Обновить страницу
                    </button>
                </div>
            `;
        }
    }

    const exportBtn = document.getElementById('exportMainCsv');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const productCards = document.querySelectorAll('.product-card');
            const productsData = Array.from(productCards).map(card => {
                return {
                    id: card.dataset.productId,
                    name: card.querySelector('h3').textContent,
                    price: card.querySelector('.product-price').textContent,
                    image_path: card.querySelector('img').src,
                    manufacturer: card.dataset.manufacturer || '',
                };
            });
            AuthAPI.exportToCSV(productsData, 'filtered-products.csv');
        });
    }
}

function initMobileFilters() {
    const filtersToggle = document.getElementById('filtersToggle');
    const filtersSidebar = document.querySelector('.filters-sidebar');
    
    if (filtersToggle && filtersSidebar) {
        filtersToggle.addEventListener('click', function() {
            filtersSidebar.classList.toggle('active');
            
            // Изменяем текст кнопки
            if (filtersSidebar.classList.contains('active')) {
                filtersToggle.textContent = 'Скрыть фильтры';
            } else {
                filtersToggle.textContent = 'Фильтры';
            }
        });
    }
}

// Функция для получения всех товаров
async function fetchAllProducts() {
    try {
        const response = await fetch('/api/products', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Ошибка получения товаров с сервера');
        return await response.json();
    } catch (error) {
        console.warn('Не удалось загрузить товары с сервера. Используется локальная заглушка.', error.message);
        // Возвращаем данные-заглушки для разработки
        return [
            {
                "id": 1, "name": "RZMASH", "image_path": "https://rzmash.ru/image/cache/catalog/teploobmennoe-oborudovanie/teploobmennye-apparaty-800x800.jpg",
                "manufacturer": "German", "price": 125000, "weight": 45.5, "diameter": 300, "working_pressure": 16, "min_temp": -50, "max_temp": 200, "description": "Надёжный теплообменник от ведущего немецкого производителя."
            },
            {
                "id": 2, "name": "SWEP", "image_path": "https://qtec.spb.ru/upload/uf/17d/50vr0xz3tmy6iezvwrfhgl6m1yb46rgp.png",
                "manufacturer": "Danfoss", "price": 98700, "weight": 32.1, "diameter": 250, "working_pressure": 10, "min_temp": -30, "max_temp": 180, "description": "Компактный и эффективный теплообменник от SWEP, идеально подходит для систем ГВС."
            }
        ];
    }
}

// Функция для отправки POST запроса с фильтрами
async function fetchFilteredProducts(filters) {
    try {
        const response = await fetch('/api/products/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        });

        if (!response.ok) {
            throw new Error('Ошибка получения товаров');
        }

        const products = await response.json();
        console.log('Получено отфильтрованных товаров:', products.length);
        return products;
    } catch (error) {
        console.error('Ошибка при получении товаров:', error);
        throw error;
    }
}

// Функция для обновления отображения товаров
function updateProductsDisplay(products) {
    console.log('[LOG] updateProductsDisplay вызван, products:', products);
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) {
        console.log('[LOG] Контейнер товаров не найден');
        return;
    }
    productsGrid.innerHTML = '';
    console.log('[LOG] Контейнер товаров очищен');
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = product.id; // Убедимся, что ID сохраняется
        card.dataset.manufacturer = product.manufacturer; 

        const price = formatPrice(product.price);

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image_path || product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${price} ₽</div>
                <button class="add-to-cart">В корзину</button>
            </div>
            ${product.description ? `<div class="product-description" style="display:none;">${product.description}</div>` : ''}
        `;
        // Новый обработчик: только по фото и названию
        card.querySelector('.product-image').addEventListener('click', function(e) {
            e.stopPropagation();
            const url = `product-card.html?id=${product.id}`;
            window.location.href = url;
        });
        card.querySelector('h3').addEventListener('click', function(e) {
            e.stopPropagation();
            const url = `product-card.html?id=${product.id}`;
            window.location.href = url;
        });
        // Кнопка "В корзину" работает отдельно
        productsGrid.appendChild(card);
        console.log(`[LOG] Карточка товара ${product.id} добавлена в DOM`);
    });
    console.log('[LOG] Все карточки товаров созданы, инициализация кнопок...');
    initAddToCartButtons(products);
    // Проверим, что карточки реально в DOM
    console.log('[LOG] Количество .product-card в DOM:', document.querySelectorAll('.product-card').length);
}

function initFilters() {
    // Price range slider
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceMinValue = document.getElementById('priceMinValue');
    const priceMaxValue = document.getElementById('priceMaxValue');
    
    if (priceMin && priceMax) {
        priceMin.addEventListener('input', function() {
            priceMinValue.textContent = formatPrice(this.value) + ' ₽';
            if (parseInt(this.value) > parseInt(priceMax.value)) {
                priceMax.value = this.value;
                priceMaxValue.textContent = formatPrice(this.value) + ' ₽';
            }
        });
        
        priceMax.addEventListener('input', function() {
            priceMaxValue.textContent = formatPrice(this.value) + ' ₽';
            if (parseInt(this.value) < parseInt(priceMin.value)) {
                priceMin.value = this.value;
                priceMinValue.textContent = formatPrice(this.value) + ' ₽';
            }
        });
    }
    
    // Pressure range slider
    const pressureMin = document.getElementById('pressureMin');
    const pressureMax = document.getElementById('pressureMax');
    const pressureMinValue = document.getElementById('pressureMinValue');
    const pressureMaxValue = document.getElementById('pressureMaxValue');
    
    if (pressureMin && pressureMax) {
        pressureMin.addEventListener('input', function() {
            pressureMinValue.textContent = this.value + ' бар';
            if (parseInt(this.value) > parseInt(pressureMax.value)) {
                pressureMax.value = this.value;
                pressureMaxValue.textContent = this.value + ' бар';
            }
        });
        
        pressureMax.addEventListener('input', function() {
            pressureMaxValue.textContent = this.value + ' бар';
            if (parseInt(this.value) < parseInt(pressureMin.value)) {
                pressureMin.value = this.value;
                pressureMinValue.textContent = this.value + ' бар';
            }
        });
    }

    // Обработчик кнопки "Применить фильтры"
    const applyFiltersBtn = document.querySelector('.apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', async function() {
            try {
                // Собираем все фильтры
                const filters = {
                    manufacturers: Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                        .map(cb => cb.value),
                    priceRange: {
                        min: parseInt(priceMin?.value) || 0,
                        max: parseInt(priceMax?.value) || 200000
                    },
                    pressureRange: {
                        min: parseInt(pressureMin?.value) || 0,
                        max: parseInt(pressureMax?.value) || 25
                    },
                    diameterRange: {
                        min: parseInt(document.getElementById('diameterMin')?.value) || 0,
                        max: parseInt(document.getElementById('diameterMax')?.value) || 1000
                    },
                    temperatureRange: {
                        min: parseInt(document.getElementById('tempMin')?.value) || -100,
                        max: parseInt(document.getElementById('tempMax')?.value) || 300
                    }
                };

                // Показываем индикатор загрузки
                applyFiltersBtn.textContent = 'Загрузка...';
                applyFiltersBtn.disabled = true;

                // Отправляем запрос
                const products = await fetchFilteredProducts(filters);
                
                // Обновляем отображение
                updateProductsDisplay(products);

            } catch (error) {
                alert('Ошибка при применении фильтров: ' + error.message);
            } finally {
                // Восстанавливаем кнопку
                applyFiltersBtn.textContent = 'Применить фильтры';
                applyFiltersBtn.disabled = false;
            }
        });
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

// Добавление товара в корзину из магазина
function initAddToCartButtons(productsList) {
    console.log('Инициализация кнопок добавления в корзину');
    const sourceProducts = productsList || window.products || [];

    document.querySelectorAll('.product-card, .product-card-large').forEach((card) => {
        const btn = card.querySelector('.add-to-cart');
        if (!btn) return;

        const productId = card.dataset.productId || card.dataset.id;
        if (!productId) return;

        let product = sourceProducts.find(p => String(p.id) === String(productId));
        
        if (!product && window.currentProduct && String(window.currentProduct.id) === String(productId)) {
            product = window.currentProduct;
        }

        if (!product) {
            console.warn(`Товар с ID ${productId} не найден для инициализации кнопки.`);
            return;
        }

        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        const qty = Cart.getItemQty(productId);
        updateProductButton(card, qty, product);

        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (Cart.getItemQty(productId) === 0) {
                Cart.addItem(product);
                updateProductButton(card, 1, product);
                updateCartIndicator();
            }
        });
    });
}

function updateProductButton(card, qty, product) {
    const btn = card.querySelector('.add-to-cart');
    const infoBlock = card.querySelector('.product-info, .product-card-large-info');
    let qtyControls = card.querySelector('.product-qty-controls');
    
    if (qty > 0) {
        if (btn) btn.style.display = 'none';
        if (qtyControls) {
            qtyControls.querySelector('.product-qty').textContent = qty;
        } else {
            qtyControls = document.createElement('div');
            qtyControls.className = 'product-qty-controls active';
            qtyControls.innerHTML = `
                <button class="product-qty-btn" data-action="dec">-</button>
                <span class="product-qty">${qty}</span>
                <button class="product-qty-btn" data-action="inc">+</button>
            `;
            if (infoBlock) infoBlock.appendChild(qtyControls);
            else card.appendChild(qtyControls);
            
            qtyControls.querySelector('[data-action="dec"]').addEventListener('click', function() {
                const currentQty = Cart.getItemQty(product.id);
                if (currentQty > 1) {
                    Cart.updateQty(product.id, currentQty - 1);
                    updateProductButton(card, currentQty - 1, product);
                } else {
                    Cart.removeItem(product.id);
                    updateProductButton(card, 0, product);
                }
                updateCartIndicator();
            });
            
            qtyControls.querySelector('[data-action="inc"]').addEventListener('click', function() {
                const currentQty = Cart.getItemQty(product.id);
                Cart.updateQty(product.id, currentQty + 1);
                updateProductButton(card, currentQty + 1, product);
                updateCartIndicator();
            });
        }
    } else {
        if (btn) btn.style.display = 'block';
        if (qtyControls) qtyControls.remove();
    }
}

// Обновление индикатора корзины
function updateCartIndicator() {
    console.log('Обновление индикатора корзины');
    const indicator = document.querySelector('.cart-indicator');
    if (!indicator) {
        console.log('Индикатор корзины не найден');
        return;
    }
    
    const totalItems = Cart.getTotalItems();
    console.log('Общее количество товаров в корзине:', totalItems);
    indicator.textContent = totalItems;
    
    if (totalItems > 0) {
        indicator.classList.remove('hidden');
        console.log('Индикатор корзины показан');
    } else {
        indicator.classList.add('hidden');
        console.log('Индикатор корзины скрыт');
    }
}

// Функция для выхода из системы
function logout() {
    console.log('Выход из системы');
    AuthAPI.removeToken();
    AuthAPI.removeUserInfo();
    console.log('Токен и информация о пользователе удалены');
    alert('Вы вышли из системы');
    window.location.href = 'index.html';
}

// Функция для проверки авторизации и обновления UI
function updateAuthUI() {
    console.log('Обновление UI авторизации');
    const profileBtn = document.querySelector('.profile-btn');
    const adminBtn = document.querySelector('.admin-btn');
    
    if (AuthAPI.isAuthenticated()) {
        console.log('Пользователь авторизован');
        const userRole = AuthAPI.getUserRole();
        console.log('Роль пользователя:', userRole);
        
        if (profileBtn) {
            profileBtn.textContent = 'Профиль (Выйти)';
            profileBtn.onclick = logout;
        }
        
        // Показываем кнопку админа только для пользователей с ролью ADMIN
        if (adminBtn) {
            if (AuthAPI.isAdmin()) {
                console.log('Пользователь является админом, показываем кнопку админа');
                adminBtn.style.display = 'inline-block';
            } else {
                console.log('Пользователь не является админом, скрываем кнопку админа');
                adminBtn.style.display = 'none';
            }
        }
    } else {
        console.log('Пользователь не авторизован');
        if (profileBtn) {
            profileBtn.textContent = 'Профиль';
            profileBtn.onclick = function() {
                const authModal = document.getElementById('authModal');
                if (authModal) {
                    authModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            };
        }
        
        // Скрываем кнопку админа для неавторизованных пользователей
        if (adminBtn) {
            console.log('Пользователь не авторизован, скрываем кнопку админа');
            adminBtn.style.display = 'none';
        }
    }
} 

// Поиск
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (query) {
            await fetchSearchedProducts(query);
        } else {
            // Если поле поиска пустое, показываем все товары
            await fetchAllProducts();
        }
    };

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
}

async function fetchSearchedProducts(query) {
    console.log(`Searching for: ${query}`);
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '<p>Поиск...</p>'; // Показываем индикатор загрузки

    try {
        const response = await fetch(`/api/products/search?name=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.statusText}`);
        }
        const products = await response.json();
        updateProductsDisplay(products);
    } catch (error) {
        console.error('Ошибка при поиске товаров:', error);
        productsGrid.innerHTML = `<p>Не удалось выполнить поиск. ${error.message}</p>`;
    }
} 