// Проверяем авторизацию при загрузке
document.addEventListener('DOMContentLoaded', function() {
    if (!AuthAPI.isAuthenticated() || !AuthAPI.isAdmin()) {
        alert('Доступ запрещен. Необходима авторизация с правами администратора.');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('Пользователь авторизован как администратор.');
    
    // Автоматически загружаем товары при входе на страницу
    loadProducts();
});

// Обработчик добавления товара
document.getElementById('addProductForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const product = {
        name: formData.get('name'),
        image_path: formData.get('image_path'),
        manufacturer: formData.get('manufacturer'),
        price: parseFloat(formData.get('price')),
        weight: parseFloat(formData.get('weight')),
        diameter: parseFloat(formData.get('diameter')),
        working_pressure: parseFloat(formData.get('working_pressure')),
        min_temp: parseFloat(formData.get('min_temp')),
        max_temp: parseFloat(formData.get('max_temp'))
    };
    
    try {
        const response = await fetch('/api/admin/products/save_device', {
            method: 'POST',
            headers: AuthAPI.getAuthHeaders(), // Используем общие заголовки
            body: JSON.stringify(product)
        });
        
        if (response.ok) {
            alert('Товар успешно добавлен!');
            e.target.reset();
            loadProducts();
        } else {
            const error = await response.text();
            alert('Ошибка: ' + error);
        }
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
});

// Загрузка товаров
async function loadProducts() {
    try {
        const response = await fetch('/api/admin/products/all_devices', {
            headers: AuthAPI.getAuthHeaders()
        });
        
        if (response.ok) {
            const products = await response.json();
            displayProducts(products);
        } else {
            const error = await response.text();
            alert('Ошибка загрузки товаров: ' + error);
        }
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
}

// Отображение товаров
function displayProducts(products) {
    const container = document.getElementById('productsList');
    container.innerHTML = '';
    
    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-item';
        // Используем product.id для ключей, так как бэкенд возвращает 'id'
        item.innerHTML = `
            <div class="product-info">
                <strong>${product.name}</strong> - ${product.manufacturer}<br>
                ID: ${product.id}
            </div>
            <div class="product-actions">
                <button onclick="deleteProduct(${product.id})" class="btn-admin">Удалить</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Удаление товара
async function deleteProduct(id) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/products/delete_device/${id}`, {
            method: 'DELETE',
            headers: AuthAPI.getAuthHeaders()
        });

        if (response.ok) {
            alert('Товар успешно удален!');
            loadProducts(); // Обновляем список после удаления
        } else {
            const error = await response.text();
            alert('Ошибка удаления: ' + error);
        }
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
} 