--begin;
drop table if exists items;
DROP table if exists payments;
drop table if exists orders;
drop table if exists customers;
DROP table if exists localities;
drop table if exists products;
DROP table if exists sections;
DROP table if exists cashiers;
DROP table if exists users;

create table payments(
	id integer primary key,
	price real not null,
	order_id integer not null,
	payment_type char,
	created_at datetime not null,
	updated_at datetime,
	deleted_at datetime,
	foreign key (order_id) references orders (id)
);
create table cashiers(
	id integer primary key,
	user_id integer not null,
	money real,
	debit real,
	credit real,
	ticket real,
	created_at datetime not null,
	updated_at datetime,
	deleted_at datetime,
	foreign key (user_id) references users (id)
);

create table items(
	id integer primary key,
	quantity integer not null,
	product_id integer not null,
	price real not null,
	order_id integer not null,
	created_at datetime not null,
	updated_at datetime,
	deleted_at datetime,
	foreign key (order_id) references orders (id),
	foreign key (product_id) references products (id)
);

create table products (
	id integer primary key,
	id_remoto integer,
	name varchar(50) not null,
	price real not null,
	section_id integer not null,
	ask_obs boolean default(true),
	created_at datetime,
	updated_at datetime,
	deleted_at datetime,
	foreign key (section_id) references sections(id)
);

CREATE table localities(
	id integer primary key,
	name varchar(20) not null,
	product_id integer not null,
	foreign key (product_id) references products (id)
	
);

CREATE table sections(
	id integer primary key,
	remote_id integer not null ,
	name varchar(50) not null	
);

CREATE table orders(
	id integer primary key,
	cashier_id integer not null,
	customer_id integer,
	order_type integer not null,
	created_at datetime not null,
	updated_at datetime,
	deleted_at datetime,
	foreign key (cashier_id) references cashiers (id)
	foreign key (customer_id) references cashiers (customer_id)
);

CREATE table customers(
	id integer primary key,
	name varchar(50) not null,
	address varchar(50) not null,
	phone varchar(11) unique not null,
	locality_id integer not null,
	foreign key (locality_id) references localities(id)
);

CREATE table users(
	id integer primary key,
	remote_id integer not null,
	name varchar(50) not null,
	phone varchar(11) unique not null,
	password varchar(32) not null,
	role_type varchar(10)not null,
	created_at datetime not null,
	updated_at datetime,
	deleted_at datetime
);

PRAGMA foreign_keys = ON;
--commit;