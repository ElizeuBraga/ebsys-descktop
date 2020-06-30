--begin;
drop table if exists orders;
drop table if exists products;
drop table if exists customers;
drop table if exists items;
DROP table if exists sections;
DROP table if exists locality;
DROP table if exists cashiers;

create table cashiers(
	id integer primary key,
	opened_at datetime not null,
	closed_at datetime
);

create table items(
	id integer,
	quantity integer not null,
	product_id integer not null,
	order_id integer not null,
	foreign key (order_id) references orders (id)
	foreign key (product_id) references products (id)
);

create table products (
	id integer primary key,
	name varchar(50) not null,
	price real not null,
	section_id integer not null,
	foreign key (section_id) references sections(id)
);

CREATE table sections(
	id integer primary key,
	name varchar(50) not null	
);

CREATE table orders(
	id integer primary key,
	total real not null,
	payment char(1) not null,
	created_at datetime not null,
	customer_id integer default 1,
	cashier_id integer not null,
	foreign key (customer_id) references customers (id),
	foreign key (cashier_id) references cashiers (id)
);

CREATE table customers(
	id integer primary key,
	name varchar(50) not null,
	address varchar(50) not null,
	phone varchar(11) unique not null,
	locality_id integer not null,
	foreign key (locality_id) references locality(id)
);

CREATE table locality(
	id integer primary key,
	name varchar(20) not null,
	price real not null
);
PRAGMA foreign_keys = ON;
--commit;