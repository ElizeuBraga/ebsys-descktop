begin;
-- 	SET FOREIGN_KEY_CHECKS=ON;
	drop database if exists ebsys_descktop;
	create database if not exists ebsys_descktop;
	use ebsys_descktop;

	-- made in ws
	CREATE table if not exists pages(
		id integer auto_increment primary key,
		name varchar(50) not null,
		model varchar(50),
		url varchar(100),
		visible boolean default false,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP null,
		deleted_at TIMESTAMP null
	);
	
	-- made in ws
	CREATE table if not exists sections(
		id integer auto_increment primary key,
		name varchar(50) not null,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP null,
		deleted_at TIMESTAMP null
	);
	
	-- made in ws
	create table if not exists products (
		id integer auto_increment primary key,
		name varchar(50) not null,
		price real not null,
		section_id integer not null,
		ask_obs boolean not null default 1,
		updated boolean not null default 1,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP null,
		deleted_at TIMESTAMP null,
		foreign key (section_id) references sections(id)
	);
	
	CREATE table profiles(
		id integer auto_increment primary key,
		name varchar(15),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null
	);
	-- made in ws
	CREATE table if not exists users(
		id integer auto_increment primary key,
		name varchar(20) not null,
		email varchar(50) unique not null,
		phone varchar(11) unique not null,
		password varchar(60) not null,
		token varchar(60),
		updated boolean not null default 1,
		change_password boolean not null default 1,
		profile_id integer not null,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null,
		foreign key (profile_id) references profiles(id)
	);
	
	-- made in ws
	CREATE table if not exists cities(
		id integer auto_increment primary key,
		name varchar(20) not null,
		updated boolean not null default 1,
		product_id integer not null,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null,
		foreign key (product_id) references products (id)
	);
	
	-- made in local
	CREATE table if not exists customers(
		id integer auto_increment primary key,
		name varchar(50) not null,
		phone varchar(11) unique not null,
		updated boolean not null default 1,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null
	);

	-- made in ws
	CREATE table if not exists adresses(
		id integer auto_increment primary key,
		address varchar(30) not null,
		complement varchar(30),
		updated boolean not null default 1,
		city_id integer not null,
		customer_id integer not null,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null,
		foreign key (customer_id) references customers (id),
		foreign key (city_id) references cities (id)
		
	);
	
	-- made in local
	create table if not exists cashiers(
		id integer auto_increment primary key,
		user_id integer not null,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null,
		foreign key (user_id) references users (id)
	);

	create table if not exists payments(
		id integer auto_increment primary key,
		name varchar(7),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null
	);
	
	-- made in local
	create table if not exists payments_cashiers(
		id integer auto_increment primary key,
		payment_id integer not null,
		cashier_id integer not null,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null,
		foreign key (payment_id) references payments (id),
		foreign key (cashier_id) references cashiers (id)
	);
	
	
	-- made in local
	CREATE table if not exists order_types(
		id integer auto_increment primary key,
		name varchar(10),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null
	);

	-- made in local
	CREATE table if not exists orders(
		id integer auto_increment primary key,
		cashier_id integer not null,
		customer_id integer,
		order_types_id integer not null,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null,
		foreign key (cashier_id) references cashiers (id),
		foreign key (customer_id) references customers (id),
		foreign key (order_types_id) references order_types (id)
	);
	
	-- made in local
	create table if not exists items(
		id integer auto_increment primary key,
		quantity integer not null,
		product_id integer not null,
		price real not null,
		order_id integer not null,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null,
		foreign key (order_id) references orders (id),
		foreign key (product_id) references products (id)
	);


	create table if not exists payments_orders(
		id integer auto_increment primary key,
		order_id integer not null,
		payment_id integer not null,
		price real not null,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null,
		foreign key (payment_id) references payments (id),
		foreign key (order_id) references orders (id)
	);

	create table if not exists updateds(
		id integer auto_increment primary key,
		table_name varchar(30) not null,
		made_in varchar(5) not null,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp null,
		deleted_at timestamp null
	);
commit;