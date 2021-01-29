import { DB } from "./DB";
import { Helper } from "./Helper";
const util    = require('util');

const db = new DB();
const table = 'cashiers';
const helper = new Helper();

export class Cashier {
    constructor() {

    }

    async all(user_id) {
        return 
        let sql = "select * from cashiers c where user_id = " + user_id + " order by updated_at DESC";
        let cashiers = []
        await db.all(sql).then((rows)=>{
            cashiers = rows
        })
        return cashiers
    }

    remove_character(str, char_pos) 
    {
        let part1 = str.substring(0, char_pos);
        let part2 = str.substring(char_pos + 1, str.length);
        return (part1 + part2);
    }

    async update(amounts) {
        let newArray = []

        for (const a of amounts) {
            const todo = await fetch(a)
            if(a.name === 'Dinheiro'){
                newArray.push({money:a.value})
            }else if(a.name === 'Débito'){
                newArray.push({debit:a.value})
            }else if(a.name === 'Crédito'){
                newArray.push({credit:a.value})
            }else{
                newArray.push({ticket:a.value})
            }
        }
        let cashier = await this.detail();
        
        let user = JSON.parse(localStorage.getItem('user'));
        console.log(user)
        if(cashier[0].user_id != user.id){
            return false
        }
        let result = await db.update(table, newArray, cashier[0].id);

        return result;


    }

    async create() {
        let user = JSON.parse(localStorage.getItem('user'))

        let cashier = [
            {user_id: user.id}
        ]
        db.insert(table, cashier);
    }

    async detail(){
        let sql = "select * from cashiers c2 where updated_at is null"

        let result = await db.select(table, sql);

        return result;
    }

    async isOpen(){
        let sql = "select * from cashiers c2 where updated_at is null"

        let result = await db.select(table, sql);

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