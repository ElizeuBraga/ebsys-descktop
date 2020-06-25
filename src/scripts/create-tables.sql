--begin;
drop table if exists products;
drop table if exists customers;
drop table if exists orders;
drop table if exists items;
DROP table if exists sections;
DROP table if exists localities;

CREATE table sections(
	name varchar(50)	
);

CREATE table localities(
	name varchar(20),
	price real
);

create table products (
	name varchar(50),
	price real,
	section_id integer
);

CREATE table customers(
	name varchar(50),
	address varchar(50),
	phone varchar(11) unique
);

CREATE table orders(
	customer_id integer,
	total real,
	created_at date
);

create table items(
	order_id integer,
	product_id integer,
	quantity integer
);
--commit;