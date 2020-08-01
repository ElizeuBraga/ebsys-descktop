select * from payments;
select opened_at from cashiers where  date() = opened_at ;

insert into cashiers (opened_at)values(datetime())

select date(datetime());
select datetime('now', 'localtime')


SELECT name FROM sqlite_master WHERE type='table';

select * from products p ;
select * from products p2 ;
SELECT * from localities l ;
select * from rates r ;
select * from sections s ;

select * from customers c;

INSERT into customers(name, address, phone, locality_id) values('Elizeu Braga', 'Q15', '61998636231', 1);

select * from products p where section_id = 1;

UPDATE products set price = price + 10000 WHERE section_id = 1;
