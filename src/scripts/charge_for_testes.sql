-- Sections
INSERT INTO sections(name)VALUES('Hamburguers');
INSERT INTO sections(name)VALUES('Taxas');
-- products
INSERT INTO products(name, price, section_id, ask_obs)VALUES('Bomba atômica', 7.99, (select max(id) from sections where name = 'Hamburguers' limit 1), TRUE);
INSERT INTO products(name, price, section_id, ask_obs)VALUES('X tudo', 11.99, (select max(id) from sections where name = 'Hamburguers' limit 1), TRUE);
INSERT INTO products(name, price, section_id, ask_obs)VALUES('Taxa de entrega 1', 3.00, (select max(id) from sections where name = 'Taxas' limit 1), TRUE);
INSERT INTO products(name, price, section_id, ask_obs)VALUES('Taxa de entrega 2', 5.00, (select max(id) from sections where name = 'Taxas' limit 1), TRUE);

-- profiles
insert into profiles(name)values('Adimin');

-- users
insert into users(name,email,phone,password,token,updated,change_password,profile_id)values('Elizeu', 'elizeu@gmail.com', '61998636231', '$2y$10$sXZ2Yw.SdaUwJIoLpx9OKuvT.Y1c0uGisD4tcHBitL/n6SospzRXy',
	'12345', true, true, (select id from profiles where name = 'Adimin' limit 1)
);

-- cities
insert into cities (name,product_id)values('Sobradinho I', (select id from products where name = 'Taxa de entrega 1' limit 1));
insert into cities (name,product_id)values('Sobradinho II', (select id from products where name = 'Taxa de entrega 2' limit 1));

-- customers
insert into customers (name,phone)values('Luana', '61998636232');

-- adresses
insert into adresses (address,complement,city_id, customer_id)values('Q15 Conj c cs 12', null, 
	(select id from cities where name = 'Sobradinho I' limit 1),
		(select id from customers where name = 'Luana' limit 1)
);


-- cashiers
insert into cashiers (user_id)values((select id from users where name = 'Elizeu' LIMIT 1));

-- payments
INSERT into payments(name)values('Money');
INSERT into payments(name)values('Crédit');
-- payments cashiers

INSERT into payments_cashiers(payment_id,cashier_id)values(
	(select id from payments WHERE name = 'Money'),
	(
		SELECT c.id from cashiers c
		join users u on u.id = c.user_id where u.name = 'Elizeu' limit 1
	)
);

-- order_types
insert into order_types(name)values('Delivery');
insert into order_types(name)values('Balcão');

-- orders
INSERT orders(cashier_id,customer_id,order_types_id)values(
	(
		SELECT c.id from cashiers c
		join users u on u.id = c.user_id where u.name = 'Elizeu' limit 1
	),
	(
		SELECT id from customers where name = 'Luana' limit 1
	),
	(
		SELECT id from order_types where name = 'Delivery' limit 1
	)
);

-- items
insert into items (quantity,product_id,price,order_id)values(
	3,
	(select id from products where name = 'Bomba atômica' limit 1),
	(select price from products where name = 'Bomba atômica' limit 1),
	(
		SELECT c.id from customers c
		join orders o on o.customer_id = c.id
		where c.name = 'Luana' limit 1
	)
);
