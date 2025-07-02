// Heat Exchangers Store - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    console.log('Heat Exchangers Store application loaded');
    
    // Инициализация приложения
    initApp();
});

function initApp() {
    // Основная логика приложения будет здесь
    console.log('Application initialized');
    
    // Мобильные фильтры
    initMobileFilters();
    
    // Инициализация фильтров
    initFilters();
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
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
} 