-- Удаляем пользователя если существует и создаем заново
DROP USER IF EXISTS 'Phoenix'@'%';
CREATE USER 'Phoenix'@'%' IDENTIFIED BY '05032024';
GRANT ALL PRIVILEGES ON heat_exchangers_store.* TO 'Phoenix'@'%';
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS heat_exchangers_store;

USE heat_exchangers_store;

CREATE TABLE IF NOT EXISTS heat_exchangers_devices (
	device_id BIGINT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	image_path VARCHAR(255),
	manufacturer VARCHAR(100) NOT NULL,
	price DECIMAL(10, 2),
	weight DECIMAL(10, 2),
	diameter DECIMAL(10, 2),
	working_pressure DECIMAL(10, 2),
	min_temp DECIMAL(6, 2),
	max_temp DECIMAL(6, 2)
);

CREATE TABLE IF NOT EXISTS users (
	user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	username VARCHAR(100),
	surname VARCHAR(100),
	role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS cart (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	user_id BIGINT NOT NULL,
	device_id BIGINT NOT NULL,
	added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (device_id) REFERENCES heat_exchangers_devices(device_id) ON DELETE CASCADE
);

INSERT INTO heat_exchangers_devices (
	name,
	image_path,
	manufacturer,
	price,
	weight,
	diameter,
	working_pressure,
	min_temp,
	max_temp
) VALUES
('RZMASH', 'https://rzmash.ru/image/cache/catalog/teploobmennoe-oborudovanie/teploobmennye-apparaty-800x800.jpg', 'German', 125000.00, 45.5, 300.00, 16.00, -50.00, 200.00),
('SWEP', 'https://qtec.spb.ru/upload/uf/17d/50vr0xz3tmy6iezvwrfhgl6m1yb46rgp.png', 'Danfoss', 98700.00, 32.1, 250.00, 10.00, -30.00, 180.00);

-- Создание пользователей (пароли захешированы с BCrypt)
-- Админ: admin/admin1
-- Пользователь: user/user123
INSERT INTO users (password, email, username, surname, role) VALUES
('$2a$10$MOtat7WdPSK/SttJOdoGo.dE.Amlpx0smmLmWO9dTaucTKQ0IXrcC', 'admin@example.com', 'Администратор', 'Системы', 'ADMIN'),
('$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user@example.com', 'Обычный', 'Пользователь', 'USER');
