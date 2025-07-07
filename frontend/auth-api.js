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

    // Сохранение информации о пользователе
    static saveUserInfo(userInfo) {
        localStorage.setItem('user_info', JSON.stringify(userInfo));
    }

    // Получение информации о пользователе
    static getUserInfo() {
        const userInfo = localStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    }

    // Удаление информации о пользователе
    static removeUserInfo() {
        localStorage.removeItem('user_info');
    }

    // Проверка, является ли пользователь админом
    static isAdmin() {
        const userInfo = this.getUserInfo();
        return userInfo && userInfo.role === 'ADMIN';
    }

    // Получение роли пользователя
    static getUserRole() {
        const userInfo = this.getUserInfo();
        return userInfo ? userInfo.role : null;
    }
} 