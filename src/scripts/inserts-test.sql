select * from payments;
select opened_at from cashiers where  date() = opened_at ;

insert into cashiers (opened_at)values(datetime())

select date(datetime());
select datetime('now', 'localtime')


SELECT name FROM sqlite_master WHERE type='table';

select * from products p ;
select * from products p2 ;
SELECT * from locality l ;
select * from rates r ;
select * from sections s ;