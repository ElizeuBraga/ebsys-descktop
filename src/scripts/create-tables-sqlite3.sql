--begin;
PRAGMA foreign_keys = ON;
drop table if exists items;
DROP table if exists payments;
drop table if exists orders;
drop table if exists customers;
DROP table if exists localities;
drop table if exists products;
DROP table if exists sections;
DROP table if exists cashiers;
DROP table if exists users;
drop table if exists logs_errors;

--made in ws
create table products (
	id integer primary key not null,
	name varchar(50) not null,
	price real not null,
	ask_obs boolean
);

--made in server
CREATE table localities(
	id integer primary key not null,
	"name" varchar(20) not null,
	product_id integer not null,
	foreign key (product_id) references products (id)
	
);

--made in server
CREATE table users(
	id integer primary key not null,
	name varchar(20) not null,
	email varchar(50) unique not null,
	phone varchar(11) unique not null,
	"password" varchar(60) not null,
	change_password boolean default(true)
);

--made in local
CREATE table customers(
	id integer primary key,
	name varchar(50) not null,
	address varchar(50) not null,
	phone varchar(11) unique not null,
	locality_id integer not null,
	created_at timestamp default(datetime()),
	updated_at timestamp,
	deleted_at timestamp,
	foreign key (locality_id) references localities(id)
);

--made in local
create table cashiers(
	id integer primary key,
	user_id integer not null,
	"money" real,
	debit real,
	credit real,
	ticket real,
	created_at timestamp default(datetime()),
	updated_at timestamp,
	deleted_at timestamp,
	foreign key (user_id) references users (id)
);

--made in local
CREATE table orders(
	id integer primary key,
	cashier_id integer not null,
	customer_id integer,
	money real not null default(0),
	debit real not null default(0),
	credit real not null default(0),
	ticket real not null default(0),
	order_type integer not null,
	created_at timestamp default(datetime()),
	updated_at timestamp,
	deleted_at timestamp,
	foreign key (cashier_id) references cashiers (id),
	foreign key (customer_id) references customers (id)
);

--made in local
create table items(
	id integer primary key,
	quantity integer not null,
	product_id integer not null,
	price real not null,
	order_id integer not null,
	created_at timestamp default(datetime()),
	updated_at timestamp,
	deleted_at timestamp,
	foreign key (order_id) references orders (id),
	foreign key (product_id) references products (id)
);

CREATE table logs_errors(
	log text,
	model text,
	"method" text,
	created_at timestamp default(datetime())
);

--commit;