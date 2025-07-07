document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        // Очистка старых ошибок
        removeErrors();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        let valid = true;

        if (name.length < 2) {
            showError(form.name, 'Имя должно быть не менее 2 символов');
            valid = false;
        }
        if (!validateEmail(email)) {
            showError(form.email, 'Некорректный email');
            valid = false;
        }
        if (password.length < 6) {
            showError(form.password, 'Пароль должен быть не менее 6 символов');
            valid = false;
        }
        if (password !== confirmPassword) {
            showError(form.confirmPassword, 'Пароли не совпадают');
            valid = false;
        }

        if (valid) {
            try {
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Регистрация...';
                submitBtn.disabled = true;
                
                const response = await AuthAPI.signup({ username: name, email, password });
                AuthAPI.saveToken(response.jwt);
                
                alert('Регистрация успешна!');
                window.location.href = 'profile.html';
            } catch (error) {
                alert('Ошибка регистрации: ' + error.message);
            } finally {
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Зарегистрироваться';
                submitBtn.disabled = false;
            }
        }
    });

    function showError(input, message) {
        input.classList.add('input-error');
        let error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        input.parentNode.insertBefore(error, input.nextSibling);
    }

    function removeErrors() {
        form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        form.querySelectorAll('.error-message').forEach(el => el.remove());
    }

    function validateEmail(email) {
        return /^\S+@\S+\.\S+$/.test(email);
    }
});

// Стили для ошибок
const style = document.createElement('style');
style.textContent = `
.input-error {
    border-color: #e74c3c !important;
}
.error-message {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-bottom: 0.7rem;
    margin-top: -0.7rem;
}
`;
document.head.appendChild(style); 