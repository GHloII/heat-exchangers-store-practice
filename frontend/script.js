// Heat Exchangers Store - Main JavaScript File

// Класс для товара
class Product {
    constructor(id, name, price, image, manufacturer = '', pressure = 0, diameter = 0, temperature = 0) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.manufacturer = manufacturer;
        this.pressure = pressure;
        this.diameter = diameter;
        this.temperature = temperature;
    }

    static fromElement(card) {
        const id = card.dataset.id || card.dataset.productId || Math.random().toString(36).substr(2, 9);
        const name = card.querySelector('h3')?.textContent || '';
        const priceText = card.querySelector('.product-price')?.textContent || '';
        const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
        const image = card.querySelector('img')?.src || '';
        
        return new Product(id, name, price, image);
    }
}

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
        const idx = items.findIndex(i => i.id === product.id);
        if (idx !== -1) {
            items[idx].qty += 1;
        } else {
            items.push({ ...product, qty: 1 });
        }
        Cart.saveItems(items);
    }

    static removeItem(id) {
        const items = Cart.getItems();
        const filteredItems = items.filter(i => i.id !== id);
        Cart.saveItems(filteredItems);
    }

    static updateQty(id, qty) {
        const items = Cart.getItems();
        const idx = items.findIndex(i => i.id === id);
        if (idx !== -1) {
            items[idx].qty = qty;
            if (items[idx].qty < 1) items[idx].qty = 1;
        }
        Cart.saveItems(items);
    }

    static clear() {
        localStorage.removeItem(Cart.storageKey);
    }

    // Метод для получения общего количества товаров в корзине
    static getTotalItems() {
        const items = Cart.getItems();
        return items.reduce((total, item) => total + item.qty, 0);
    }

    // Метод для получения количества конкретного товара
    static getItemQty(productId) {
        const items = Cart.getItems();
        const item = items.find(i => i.id === productId);
        return item ? item.qty : 0;
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Heat Exchangers Store application loaded');
    
    // Инициализация приложения
    await initApp();

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
                try {
                    // Показываем индикатор загрузки
                    const submitBtn = loginForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Вход...';
                    submitBtn.disabled = true;

                    const response = await AuthAPI.signin({ email, password });
                    
                    // Сохраняем токен
                    AuthAPI.saveToken(response.jwt);
                    
                    alert('Вход выполнен успешно!');
                    authModal.style.display = 'none';
                    document.body.style.overflow = '';
                    loginForm.reset();
                    window.location.href = 'profile.html';
                } catch (error) {
                    alert('Ошибка входа: ' + error.message);
                } finally {
                    // Восстанавливаем кнопку
                    const submitBtn = loginForm.querySelector('button[type="submit"]');
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
                    
                    // Сохраняем токен
                    AuthAPI.saveToken(response.jwt);
                    
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
});

async function initApp() {
    // Основная логика приложения будет здесь
    console.log('Application initialized');
    
    // Обновляем UI в зависимости от авторизации
    updateAuthUI();
    
    // Мобильные фильтры
    initMobileFilters();
    
    // Инициализация фильтров
    initFilters();
    
    // Загружаем все товары при инициализации
    try {
        const products = await fetchAllProducts();
        updateProductsDisplay(products);
    } catch (error) {
        console.error('Не удалось загрузить товары:', error);
        // Если не удалось загрузить с бэкенда, оставляем статические товары
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
            method: 'POST',
            headers: AuthAPI.getAuthHeaders(),
            body: JSON.stringify({}) // Пустой объект для получения всех товаров
        });

        if (!response.ok) {
            throw new Error('Ошибка получения товаров');
        }

        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Ошибка при получении всех товаров:', error);
        throw error;
    }
}

// Функция для отправки POST запроса с фильтрами
async function fetchFilteredProducts(filters) {
    try {
        const response = await fetch('/api/products/filter', {
            method: 'POST',
            headers: AuthAPI.getAuthHeaders(),
            body: JSON.stringify(filters)
        });

        if (!response.ok) {
            throw new Error('Ошибка получения товаров');
        }

        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Ошибка при получении товаров:', error);
        throw error;
    }
}

// Функция для обновления отображения товаров
function updateProductsDisplay(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
                <button class="add-to-cart">В корзину</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });

    // Переинициализируем кнопки добавления в корзину
    initAddToCartButtons();
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
function initAddToCartButtons() {
    document.querySelectorAll('.product-card').forEach((card) => {
        const btn = card.querySelector('.add-to-cart');
        const product = Product.fromElement(card);
        const productId = product.id;
        
        // Проверяем, есть ли товар в корзине
        const qty = Cart.getItemQty(productId);
        updateProductButton(card, qty);
        
        btn.addEventListener('click', function() {
            if (qty === 0) {
                // Добавляем товар в корзину
                Cart.addItem(product);
                updateProductButton(card, 1);
                updateCartIndicator();
            }
        });
    });
}

// Обновление кнопки товара (В корзину / +/-)
function updateProductButton(card, qty) {
    const btn = card.querySelector('.add-to-cart');
    const qtyControls = card.querySelector('.product-qty-controls');
    
    if (qty > 0) {
        // Показываем кнопки +/-
        btn.style.display = 'none';
        if (!qtyControls) {
            const controls = document.createElement('div');
            controls.className = 'product-qty-controls active';
            controls.innerHTML = `
                <button class="product-qty-btn" data-action="dec" data-id="${card.dataset.id}">-</button>
                <span class="product-qty">${qty}</span>
                <button class="product-qty-btn" data-action="inc" data-id="${card.dataset.id}">+</button>
            `;
            btn.parentNode.appendChild(controls);
            
            // Добавляем обработчики для кнопок +/-
            controls.querySelector('[data-action="dec"]').addEventListener('click', function() {
                const product = Product.fromElement(card);
                const currentQty = Cart.getItemQty(product.id);
                if (currentQty > 1) {
                    Cart.updateQty(product.id, currentQty - 1);
                    updateProductButton(card, currentQty - 1);
                    updateCartIndicator();
                } else {
                    // Если количество 1, то удаляем товар
                    Cart.removeItem(product.id);
                    updateProductButton(card, 0);
                    updateCartIndicator();
                }
            });
            
            controls.querySelector('[data-action="inc"]').addEventListener('click', function() {
                const product = Product.fromElement(card);
                const currentQty = Cart.getItemQty(product.id);
                Cart.updateQty(product.id, currentQty + 1);
                updateProductButton(card, currentQty + 1);
                updateCartIndicator();
            });
        } else {
            qtyControls.classList.add('active');
            qtyControls.querySelector('.product-qty').textContent = qty;
        }
    } else {
        // Показываем кнопку "В корзину"
        btn.style.display = 'block';
        if (qtyControls) {
            qtyControls.remove(); // Удаляем элементы управления полностью
        }
    }
}

// Обновление индикатора корзины
function updateCartIndicator() {
    const indicator = document.querySelector('.cart-indicator');
    if (!indicator) return;
    
    const totalItems = Cart.getTotalItems();
    indicator.textContent = totalItems;
    
    if (totalItems > 0) {
        indicator.classList.remove('hidden');
    } else {
        indicator.classList.add('hidden');
    }
}

// Функция для выхода из системы
function logout() {
    AuthAPI.removeToken();
    alert('Вы вышли из системы');
    window.location.href = 'index.html';
}

// Функция для проверки авторизации и обновления UI
function updateAuthUI() {
    const profileBtn = document.querySelector('.profile-btn');
    if (AuthAPI.isAuthenticated()) {
        if (profileBtn) {
            profileBtn.textContent = 'Профиль (Выйти)';
            profileBtn.onclick = logout;
        }
    } else {
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
    }
} 