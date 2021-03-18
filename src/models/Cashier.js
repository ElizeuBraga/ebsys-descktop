import { DB } from "./DB";
import { Helper } from "./Helper";
import { Payment } from "./Payment";
const util    = require('util');

const db = new DB();
const table = 'cashiers';
const helper = new Helper();
const payment = new Payment();

export class Cashier {
    constructor() {

    }

    async all(dates = false) {
        let user = JSON.parse(localStorage.getItem('user'));
        
        if(!user){
            return false;
        }


        let and = ""
        if(dates){
            and = ` AND c.created_at BETWEEN '${dates[0]}' AND '${dates[1]}'`
        }

        let sql = ` SELECT
                        c.id,
                        u.name as user_name,
                        CASE WHEN (select sum(price) from payments_cashiers pc where cashier_id = c.id) > 0
                        THEN (select sum(price) from payments_cashiers pc where cashier_id = c.id) ELSE 0 END as value,
                        DATE_FORMAT(c.created_at, '%d-%m-%Y às %H:%i') as created_at,
                        DATE_FORMAT(c.updated_at, '%d-%m-%Y às %H:%i') as updated_at
                    FROM cashiers c 
                    JOIN users u on u.id = c.user_id 
                    where user_id = ${user.id} AND c.updated_at is not null ${and}
                    GROUP by c.id
                    order by c.created_at DESC`;


        let cashiers = await db.selectMany(sql);
        
        if(cashiers){
            return cashiers;
        }else{
            return []
        }
    }

    remove_character(str, char_pos) 
    {
        let part1 = str.substring(0, char_pos);
        let part2 = str.substring(char_pos + 1, str.length);
        return (part1 + part2);
    }

    async update(cashiers) {
        let sql = `UPDATE ${table} set updated_at = now() WHERE id = ${cashiers[0].id}`
        return await db.execute(sql)
    }

    async getCashierInfo(cashier_id, type){
        let and = '';
        if(type == 'B'){
            and = ' AND o.order_types_id = 1'
        }else if(type == 'D'){
            and = ' AND o.order_types_id = 2'
        }
        // return
        let sql = ` 
                SELECT
                    p.name,
                SUM(i.quantity) as quantity,
                SUM(i.price * i.quantity) as total,
                i.price
                FROM products p
                JOIN items i ON i.product_id = p.id
                JOIN orders o ON o.id = i.order_id 
                JOIN cashiers c ON c.id = o.cashier_id
                WHERE c.id = ${cashier_id} ${and}
                GROUP BY p.id, i.price;
            `;
        
        let info = await db.select(sql)

        if(info){
            return info;
        }else{
            return []
        }
    }

    async create(cashiers) {
        let response = await db.insert(table, cashiers);
        return response;
    }

    async detail(){
        let sql = `select * from ${table} c2 where updated_at is null`;

        let result = await db.selectOne(sql);

        return result;
    }

    async getOpened(){
        let sql = `select * from ${table} c2 where updated_at is null`;

        let result = await db.selectOne(sql);

        return result;
    }

    async isOpen(){
        let sql = "select * from cashiers c2 where updated_at is null"

        let result = await db.selectOne(sql);
        
        if(result){
            return true
        }
        return false;
    }

    async find() {
        
    }

    async items(cashier_id, type){
        let orderType = [];
        if(type == 'deliveries'){
            orderType = [1]
        }else if (type == 'all') {
            orderType = [0,1]
        }else{
            orderType = [0]
        }

        let sql = `select
                        p.name,
                        SUM(i.quantity) as quantity,
                        (i.quantity * i.price) as total_parcial,
                        c.money,
                        c.debit,
                        c.credit,
                        c.ticket
                        from items i join orders o on o.id = i.order_id
                    join cashiers c on c.id = o.cashier_id
                    join products p on p.id = i.product_id 
                    where c.id = `+cashier_id+` and o.order_type in(`+orderType+`) GROUP BY p.id`;

        let sql2 = `select
                        CASE WHEN SUM(o.money) IS NULL THEN 0 ELSE SUM(o.money) END money,
                        CASE WHEN SUM(o.debit) IS NULL THEN 0 ELSE SUM(o.debit) END debit,
                        CASE WHEN SUM(o.credit) IS NULL THEN 0 ELSE SUM(o.credit) END credit,
                        CASE WHEN SUM(o.ticket) IS NULL THEN 0 ELSE SUM(o.ticket) END ticket
                    from orders o
                    join cashiers c
                    on c.id = o.cashier_id
                    where c.id = `+cashier_id+` AND o.order_type in (`+orderType+`)`;
        let items = []

        await db.all(sql).then((rows)=>{
            items.push(rows)
        })

        await db.get(sql2).then((rows)=>{
            items.push(rows)
        })

        return items;
    }

    async checkUserOpenedCashier(){
        let sql = "SELECT u.* FROM cashiers c2 JOIN users u ON u.id = c2.user_id WHERE c2.updated_at IS NULL";
        let result = await db.select(table, sql);

        return result[0]
    }

    async checkCashierOwner(id){
        return false;
    }
}