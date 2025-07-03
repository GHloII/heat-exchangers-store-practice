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
            cartTotal.textContent = 'Итого: 0 ₽';
            checkoutBtn.disabled = true;
            return;
        }
        checkoutBtn.disabled = false;
        items.forEach(item => {
            total += item.price * item.qty;
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-qty-btn" data-action="dec" data-id="${item.id}">-</button>
                    <span class="cart-qty">${item.qty}</span>
                    <button class="cart-qty-btn" data-action="inc" data-id="${item.id}">+</button>
                    <button class="cart-remove-btn" data-action="remove" data-id="${item.id}" title="Удалить">×</button>
                </div>
            `;
            cartList.appendChild(el);
        });
        cartTotal.textContent = `Итого: ${total.toLocaleString()} ₽`;
    }

    cartList.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const id = btn.dataset.id;
        if (btn.dataset.action === 'inc') {
            const items = Cart.getItems();
            const item = items.find(i => i.id === id);
            if (item) {
                Cart.updateQty(item.id, item.qty + 1);
            }
            renderCart();
            updateCartIndicator();
        } else if (btn.dataset.action === 'dec') {
            const items = Cart.getItems();
            const item = items.find(i => i.id === id);
            if (item) {
                if (item.qty > 1) {
                    Cart.updateQty(item.id, item.qty - 1);
                } else {
                    Cart.removeItem(item.id);
                }
            }
            renderCart();
            updateCartIndicator();
        } else if (btn.dataset.action === 'remove') {
            Cart.removeItem(id);
            renderCart();
            updateCartIndicator();
        }
    });

    checkoutBtn.addEventListener('click', function() {
        alert('Оформление заказа пока не реализовано');
    });

    // Функция обновления индикатора корзины
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

    renderCart();
    updateCartIndicator(); // Инициализируем индикатор
}); 