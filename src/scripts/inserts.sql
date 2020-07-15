--begin transaction;
--insert into locality (name, price) values('Sobradinho', 3.00);
INSERT INTO customers (name, address, phone, locality_id)values('Skiltys', 'Q6 CL 17/19', 34531008, 1);
INSERT
	into
	sections (name)
values
	('File'),
	('Frango'),
	('Mistos'),
	('Combos'),
	('Crepes'),
	('Picanha'),
	('Bebidas'),
	('Burguers'),
	('Vitaminas'),
	('Carne de Sol'),
	('Hot dogs'),
	('Açai'),
	('Fritas'),
	('Extras');
	
INSERT
	Into products(name, price, section_id)
values
	--File
	('File egg', 10.99, 1),
	('File tudo', 13.99, 1),
	('File bacon', 10.99, 1),
	('File salada', 10.49, 1),
	('File atomico', 12.49, 1),
	--Frango
	('Frango egg', 9.99, 2),
	('Frango tudo', 12.99, 2),
	('Frango bacon', 10.49, 2),
	('Frango salada', 9.49, 2),
	('Frango atomico', 11.99, 2),
	--Mistos
	('Misto quente', 6.49, 3),
	('Misto americano', 8.00, 3),
	--Combos
	('Bomba combo', 11.99, 4),
	('X-tudo combo', 14.49, 4),
	('Frango atomico combo', 16.49, 4),
	('File atomico combo', 16.99, 4),
	('Carne de sol atomico combo', 16.99, 4),
	--Crepes
	('Crepe misto', 10.99, 5),
	('Crepe de banana', 10.99, 5),
	('Crepe de frango(catupiry)', 11.49, 5),
	--Picanha
	('Picanha atomico', 15.49, 6),
	('Picanha tudo', 16.49, 6),
	--Bebidas
	('Copo refri 300ml', 2.49, 7),
	('Copo refri 400ml', 3.49, 7),
	('Refri lata', 4.00, 7),
	('Refri 600', 5.00, 7),
	('Refri 2L', 9.00, 7),
	('Agua mineral', 2.50, 7),
	('Agua mineral c/ gas', 2.99, 7),
	('Suco de abacaxi', 5.99, 7),
	('Suco de acerola', 5.99, 7),
	('Suco de caja', 5.99, 7),
	('Suco de goiaba', 5.99, 7),
	('Suco de maracuja', 5.99, 7),
	('Suco de morango', 5.99, 7),
	('Suco de graviola', 5.99, 7),
	('Suco de cupuaçu', 5.99, 7),
	('Acerola com laranja', 5.49, 7),
	('Suco laranja 300', 4.50, 7),
	('Suco de laranja 400', 5.00, 7),
	--Burguers
	('001', 8.49, 8),
	('X burguer', 6.49, 8),
	('X salada', 7.49, 8),
	('X bacon', 8.49, 8),
	('X egg burguer', 7.49, 8),
	('Bomba vegetariana', 7.99, 8),
	('Bomba atomica', 7.99, 8),
	('X tudo', 9.99, 8),
	('Turbinado', 13.99, 8),
	('Especial', 16.99, 8),
	--Vitaminas
	('Mista', 6.49, 9),
	('Paladar', 6.99, 9),
	('Joia mel', 7.00, 9),
	('Campeã', 7.99, 9),
	--Carne de sol
	('Egg carne de sol', 9.99, 10),
	('Carne de sol bacon', 9.99, 10),
	('Carne de sol atomico', 12.49, 10),
	('Tudo carne de sol', 13.49, 10),
	--Hot dogs
	('Hot dog simples', 6.00, 11),
	('Hot dog na chapa', 7.99, 11),
	('Hot dog de frango na chapa', 8.49, 11),
	('Hot dog duplo ao molho', 7.99, 11),
	('Hot dog duplo na chapa', 10.99, 11),
	--Açais
	('Açaí 200 ml', 6.99, 12),
	('Açaí 300 ml', 7.99, 12),
	('Açaí 500 ml', 10.00, 12),
	('Açaí na tigela', 11.99, 12),
	--Fritas
	('Fritas', 5.99, 13),
	('Fritas com queijo', 10.00, 13),
	('Fritas com cheddar', 12.50, 13),
	('Fritas com bacon(queijo ou cheddar)', 12.50, 13),
	('Fritas com calabresa(catupiry ou cheddar)', 12.50, 13);
	--Extras
	
INSERT into locality(name)values('Sobradinho');
INSERT into locality(name)values('Sobradinho II');
INSERT into locality(name)values('Setor de Mansões');
INSERT into rates(name, price, locality_id)values('Taxa de entrega', 2.5, 1);
--commit;
select * from rates;