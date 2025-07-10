// Рендерит детальную карточку товара (product-card.html)
export function renderProductCard(product) {
    // Получаем актуальный объект товара из localStorage['products'] по id
    let products = [];
    try {
        products = JSON.parse(localStorage.getItem('products') || '[]');
    } catch (e) {}
    const id = product?.id || (typeof product === 'string' ? product : null);
    const realProduct = products.find(p => String(p.id) === String(id)) || product;
    if (!realProduct) {
        document.getElementById('productCard').innerHTML = '<div style="padding:2rem;text-align:center;color:#888">Товар не найден</div>';
        return;
    }
    
    // Устанавливаем data-id для контейнера
    document.getElementById('productCard').dataset.id = realProduct.id;

    // Лог для отладки
    console.log('[DEBUG] product для карточки:', realProduct);
    if (!realProduct.description) {
        console.warn('[DEBUG] У товара нет description:', realProduct);
    }
    document.getElementById('productCard').innerHTML = `
        <div class="product-card-large-img">
            <img src="${realProduct.image_path || realProduct.image || 'https://via.placeholder.com/300x200'}" alt="${realProduct.name}">
        </div>
        <div class="product-card-large-info">
            <h2>${realProduct.name}</h2>
            <div class="product-card-large-price">${realProduct.price ? realProduct.price.toLocaleString() + ' ₽' : ''}</div>
            <ul class="product-card-large-props">
                ${Object.entries(realProduct)
                    .filter(([key]) => !['id', 'image', 'image_path', 'name', 'price', 'qty', 'description'].includes(key))
                    .map(([key, value]) => `<li><b>${key}:</b> ${value}</li>`)
                    .join('')}
            </ul>
            <button class="add-to-cart">В корзину</button>
        </div>
    `;
    // Инициализируем кнопку "В корзину"
    if (typeof initAddToCartButtons === 'function') {
        initAddToCartButtons();
    } else {
        console.error('Функция initAddToCartButtons не найдена. Убедитесь, что script.js загружен.');
    }
} 