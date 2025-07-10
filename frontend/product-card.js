// Получаем id товара из query-параметра ?id=...
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Получаем товар из localStorage или window.products (если есть)
function getProductById(id) {
    // 1. Главный источник - localStorage['products']
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const fromLS = allProducts.find(p => String(p.id) === String(id));
    if (fromLS) {
        return fromLS;
    }

    // 2. Фолбэк на window.products (если пришли с главной)
    if (window.products) {
        const found = window.products.find(p => String(p.id) === String(id));
        if (found) {
            return found;
        }
    }

    // 3. Последний шанс - корзина (может быть неполным)
    const cartItems = JSON.parse(localStorage.getItem('cart_items') || '[]');
    const fromCart = cartItems.find(p => String(p.id) === String(id));
    if (fromCart) {
        return fromCart;
    }
    
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

// Импортирую функцию из нового файла
import { renderProductCard } from './renderProductDetailCard.js';

document.addEventListener('DOMContentLoaded', async function() {
    const productId = getProductIdFromUrl();
    if (!productId) {
        renderProductCard(null);
        return;
    }

    let product = getProductById(productId);
    if (!product) {
        // Если не нашли — пробуем загрузить с сервера
        product = await fetchProductById(productId);
    }
    
    // Делаем текущий товар доступным глобально для скриптов
    window.currentProduct = product;

    renderProductCard(product);
    updateCartIndicator();
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
}); 