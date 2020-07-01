---inserts de testes
select * from cashiers c2 ;
select * from orders o ;
select * from deliveries ;
select * from customers c ;
select * from items;
insert into cashiers (opened_at ) values (datetime('now'));
insert into orders (total, payment , created_at, cashier_id) values (23.00, 'M', datetime('now'), 1);
INSERT into items (quantity, product_id, order_id )values(2, 12, 1);
INSERT into items (quantity, product_id, order_id )values(12, 35, 1);
INSERT into deliveries (total,payment,created_at,customer_id,cashier_id) values (35.00, 'C', datetime('now'), 1, 1);

select
	p.name,
	p.price
	(select sum)
--	sum(i.quantity) as quantity,
--	(SUM(quantity) * price) as total
from
	products p
join items i on
	i.product_id = p.id
join orders o on
	o.id = i.order_id;
	
select 10.99*33