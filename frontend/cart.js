document.addEventListener('DOMContentLoaded', function() {
    const cartList = document.querySelector('.cart-list');
    const cartTotal = document.querySelector('.cart-total');
    const checkoutBtn = document.querySelector('.cart-checkout-btn');

    function renderCart() {
        const items = Cart.getItems();
        cartList.innerHTML = '';
        let total = 0;
        if (items.length === 0) {
            cartList.innerHTML = '<div style="text-align:center;color:#888;padding:2rem 0;">Корзина пуста</div>';
            if(cartTotal) cartTotal.textContent = 'Итого: 0 ₽';
            if(checkoutBtn) checkoutBtn.disabled = true;
            return;
        }
        if(checkoutBtn) checkoutBtn.disabled = false;
        
        items.forEach(item => {
            total += item.price * item.qty;
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.dataset.id = item.id; // Добавляем ID
            el.innerHTML = `
                <div class="cart-item-img" style="cursor:pointer;">
                    <img src="${item.image_path || item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title" style="cursor:pointer; color:#1a73e8; text-decoration:underline;">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                </div>
                <div class="cart-item-controls">
                    <button class="product-qty-btn" data-action="dec">-</button>
                    <span class="product-qty">${item.qty}</span>
                    <button class="product-qty-btn" data-action="inc">+</button>
                </div>
                <div class="cart-item-remove">
                     <button class="cart-remove-btn" data-action="remove" title="Удалить">×</button>
                </div>
            `;
            cartList.appendChild(el);
        });

        if(cartTotal) cartTotal.textContent = `Итого: ${total.toLocaleString()} ₽`;
    }

    cartList.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const card = e.target.closest('.cart-item');
        const id = card.dataset.id;
        const items = Cart.getItems();
        const product = items.find(p => String(p.id) === String(id));

        if (!product) return;

        if (btn.dataset.action === 'inc') {
            Cart.updateQty(product.id, product.qty + 1);
        } else if (btn.dataset.action === 'dec') {
            if (product.qty > 1) {
                Cart.updateQty(product.id, product.qty - 1);
            } else {
                Cart.removeItem(product.id);
            }
        } else if (btn.dataset.action === 'remove') {
            Cart.removeItem(id);
        }
        
        renderCart();
        if (typeof updateCartIndicator === 'function') {
           updateCartIndicator();
        }
    });

    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            alert('Оформление заказа пока не реализовано');
        });
    }

    renderCart();
    if (typeof updateCartIndicator === 'function') {
        updateCartIndicator();
    }
}); 