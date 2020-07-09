---inserts de testes
select * from cashiers c2 ;
select * from orders o ;
select * from deliveries ;
select * from customers c ;
select * from products p2 ;
select * from itemsorders;
insert into cashiers (opened_at ) values (datetime('now'));
insert into orders (payment , created_at, cashier_id) values ('M', datetime('now'), 1);
INSERT into itemsdeliveries (quantity, product_id, delivery_id )values(2, 12, 1);
INSERT into itemsdeliveries (quantity, product_id, delivery_id )values(12, 35, 1);

INSERT into itemsorders (quantity, product_id, order_id )values(12, 35, 1);
select last_insert_rowid();
INSERT into itemsorders (quantity, product_id, order_id )values(12, 31, 1);
INSERT into itemsorders (quantity, product_id, order_id )values(2, 3, 1);
INSERT into deliveries (payment,created_at,customer_id,cashier_id) values ('C', datetime('now'), 1, 1);

select * from items i2 ;
select
	p.name,
	p.price,
	sum(quantity) as quantity,
	sum(p.price * i.quantity) as total
from
	products p
join itemsorders i on
	i.product_id = p.id
join orders o on
	o.id = i.order_id
GROUP by
	p.id;

select
	p.name,
	p.price,
	sum(quantity) as quantity,
	sum(p.price * i.quantity) as total
from
	products p
join itemsdeliveries i on
	i.product_id = p.id
join deliveries d on
	d.id = i.delivery_id
GROUP by
	p.id;
	
select 21.98 + 71.88 + 215.64;
select 5.99*36

select last_insert_rowid() as rowid;