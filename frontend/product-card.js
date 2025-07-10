// Получаем id товара из query-параметра ?id=...
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Получаем товар из localStorage или window.products (если есть)
function getProductById(id) {
    // 1. Пробуем из window.products (если главная страница его туда положила)
    if (window.products) {
        const found = window.products.find(p => p.id === id);
        if (found) return found;
    }
    // 2. Пробуем из корзины
    const cartItems = JSON.parse(localStorage.getItem('cart_items') || '[]');
    const fromCart = cartItems.find(p => p.id === id);
    if (fromCart) return fromCart;
    // 3. Пробуем из products в localStorage (если есть)
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const fromLS = allProducts.find(p => p.id === id);
    if (fromLS) return fromLS;
    // 4. Если нигде не нашли — вернуть null (будет фолбэк ниже)
    return null;
}

async function fetchProductById(id) {
    try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Товар не найден на сервере');
        return await response.json();
    } catch (e) {
        return null;
    }
}

function renderProductCard(product) {
    if (!product) {
        document.getElementById('productCard').innerHTML = '<div style="padding:2rem;text-align:center;color:#888">Товар не найден</div>';
        return;
    }
    document.getElementById('productCard').innerHTML = `
        <div class="product-card-large-img">
            <img src="${product.image_path || product.image || 'https://via.placeholder.com/300x200'}" alt="${product.name}">
        </div>
        <div class="product-card-large-info">
            <h2>${product.name}</h2>
            <div class="product-card-large-price">${product.price ? product.price.toLocaleString() + ' ₽' : ''}</div>
            <div class="product-card-large-desc">${product.description || ''}</div>
            <ul class="product-card-large-props">
                ${product.manufacturer ? `<li><b>Производитель:</b> ${product.manufacturer}</li>` : ''}
                ${product.weight ? `<li><b>Вес:</b> ${product.weight} кг</li>` : ''}
                ${product.diameter ? `<li><b>Диаметр:</b> ${product.diameter} мм</li>` : ''}
                ${product.working_pressure ? `<li><b>Рабочее давление:</b> ${product.working_pressure} бар</li>` : ''}
                ${product.min_temp !== undefined ? `<li><b>Мин. температура:</b> ${product.min_temp} °C</li>` : ''}
                ${product.max_temp !== undefined ? `<li><b>Макс. температура:</b> ${product.max_temp} °C</li>` : ''}
            </ul>
            <button class="add-to-cart">В корзину</button>
        </div>
    `;
    // Инициализируем кнопку "В корзину"
    initAddToCartButtons();
}

document.addEventListener('DOMContentLoaded', async function() {
    const productId = getProductIdFromUrl();
    let product = getProductById(productId);
    if (!product) {
        // Если не нашли — пробуем загрузить с сервера
        product = await fetchProductById(productId);
    }
    renderProductCard(product);
    updateCartIndicator();
    updateAuthUI && updateAuthUI();
}); 