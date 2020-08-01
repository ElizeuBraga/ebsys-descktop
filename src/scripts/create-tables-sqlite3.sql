--begin;
drop table if exists items;
drop table if exists orders;
drop table if exists customers;
DROP table if exists localities;
drop table if exists products;
drop table if exists deliveries ;



DROP table if exists sections;

DROP table if exists cashiers;

DROP table if exists payments;
DROP table if exists users;


create table payments(
	id integer primary key,
	price real not null,
	order_id integer not null,
	foreign key (order_id) references orders (id)
);
create table cashiers(
	id integer primary key,
	opened_at datetime not null,
	closed_at datetime
);

create table items(
	id integer primary key,
	quantity integer not null,
	product_id integer not null,
	price real not null,
	order_id integer not null,
	foreign key (order_id) references orders (id),
	foreign key (product_id) references products (id)
);

create table products (
	id integer primary key,
	name varchar(50) not null,
	price real not null,
	section_id integer not null,
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
	name varchar(50) not null	
);

CREATE table orders(
	id integer primary key,
	created_at datetime not null,
	cashier_id integer not null,
	customer_id integer,
	order_type integer not null,
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
	name varchar(50) not null,
	phone varchar(11) unique not null,
	role_type varchar(10)
);

PRAGMA foreign_keys = ON;
--commit;