select * from payments;
select opened_at from cashiers where  date() = opened_at ;

insert into cashiers (opened_at)values(datetime())

select date(datetime());
select datetime('now', 'localtime')