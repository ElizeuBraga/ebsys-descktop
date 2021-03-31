-- begin;
-- 	SET FOREIGN_KEY_CHECKS=ON;
-- 	SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
-- 	drop database if exists ebsys_descktop;
-- 	create database if not exists ebsys_descktop;
-- 	use ebsys_descktop;

-- 	drop database if exists ebsys_web;
-- 	create database if not exists ebsys_web;
-- 	use ebsys_web;
	PRAGMA foreign_keys = ON;

	-- made in ws
	CREATE TABLE IF NOT EXISTS sections(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(50) not null,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL
	);
	
	-- made in ws
	CREATE TABLE IF NOT EXISTS products (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(50) NOT NULL,
		price REAL NOT NULL,
		section_id INTEGER NOT NULL,
		ask_obs BOOLEAN NOT NULL DEFAULT 1,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL,
		FOREIGN KEY (section_id) REFERENCES sections(id)
	);
	
	CREATE TABLE IF NOT EXISTS profiles(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(15),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL
	);

	-- made in ws
	CREATE TABLE IF NOT EXISTS users(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(20) NOT NULL,
		email VARCHAR(50) UNIQUE NOT NULL,
		phone VARCHAR(11) UNIQUE NOT NULL,
		password VARCHAR(60) NOT NULL,
		token VARCHAR(60),
		change_password BOOLEAN NOT NULL DEFAULT 1,
		profile_id INTEGER NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL,
		FOREIGN KEY (profile_id) REFERENCES profiles(id)
	);
	
	-- made in ws
	CREATE TABLE IF NOT EXISTS cities(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(20) NOT NULL,
		product_id INTEGER NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL,
		FOREIGN KEY (product_id) REFERENCES products (id)
	);
	
	-- made in local
	CREATE TABLE IF NOT EXISTS customers(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(50) NOT NULL,
		phone VARCHAR(11) UNIQUE NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL
	);

	-- made in ws
	CREATE TABLE IF NOT EXISTS adresses(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		address VARCHAR(30) NOT NULL,
		complement VARCHAR(30),
		city_id INTEGER NOT NULL,
		customer_id INTEGER NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL,
		FOREIGN KEY (customer_id) REFERENCES customers (id),
		FOREIGN KEY (city_id) REFERENCES cities (id)
		
	);
	
	-- made in local
	CREATE TABLE IF NOT EXISTS cashiers(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL,
		FOREIGN KEY (user_id) REFERENCES users (id)
	);

	CREATE TABLE IF NOT EXISTS payments(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(8),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL
	);
	
	-- made in local
	CREATE TABLE IF NOT EXISTS payments_cashiers(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		payment_id INTEGER NOT NULL,
		cashier_id INTEGER NOT NULL,
		price REAL NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL,
		FOREIGN KEY (payment_id) REFERENCES payments (id),
		FOREIGN KEY (cashier_id) REFERENCES cashiers (id)
	);
	
	
	-- made in local
	CREATE TABLE IF NOT EXISTS order_types(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(10),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL
	);

	-- made in local
	CREATE TABLE IF NOT EXISTS orders(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		cashier_id INTEGER NOT NULL,
		customer_id INTEGER,
		order_types_id INTEGER NOT NULL,
		is_open bool DEFAULT 1,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL,
		FOREIGN KEY (cashier_id) REFERENCES cashiers (id),
		FOREIGN KEY (customer_id) REFERENCES customers (id),
		FOREIGN KEY (order_types_id) REFERENCES order_types (id)
	);
	
	-- made in local
	CREATE TABLE IF NOT EXISTS items(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		quantity INTEGER NOT NULL,
		product_id INTEGER NOT NULL,
		price REAL NOT NULL,
		order_id INTEGER NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL,
		FOREIGN KEY (order_id) REFERENCES orders (id),
		FOREIGN KEY (product_id) REFERENCES products (id)
	);


	CREATE TABLE IF NOT EXISTS payments_orders(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		order_id INTEGER NOT NULL,
		payment_id INTEGER NOT NULL,
		price REAL NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL,
		deleted_at TIMESTAMP NULL,
		FOREIGN KEY (payment_id) REFERENCES payments (id),
		FOREIGN KEY (order_id) REFERENCES orders (id)
	);
-- commit;