// API для авторизации
class AuthAPI {
    static baseURL = '/auth';

    // Регистрация пользователя
    static async signup(userData) {
        try {
            const response = await fetch(`${this.baseURL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password,
                    username: userData.username
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка регистрации');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            throw error;
        }
    }

    // Вход пользователя
    static async signin(loginData) {
        try {
            const response = await fetch(`${this.baseURL}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка входа');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка при входе:', error);
            throw error;
        }
    }

    // Сохранение JWT токена в localStorage
    static saveToken(token) {
        localStorage.setItem('jwt_token', token);
    }

    // Получение JWT токена из localStorage
    static getToken() {
        return localStorage.getItem('jwt_token');
    }

    // Удаление JWT токена
    static removeToken() {
        localStorage.removeItem('jwt_token');
    }

    // Проверка, авторизован ли пользователь
    static isAuthenticated() {
        return !!this.getToken();
    }

    // Получение заголовков с токеном для авторизованных запросов
    static getAuthHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }
} 