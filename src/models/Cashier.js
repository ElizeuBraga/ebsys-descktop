import { userInfo } from "os";
import sqlite3 from "sqlite3";

import { Helper } from "./Helper";
const util    = require('util');

const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.get = util.promisify(db.get);
db.run = util.promisify(db.run);
db.all = util.promisify(db.all);

const helper = new Helper();

export class Cashier {
    constructor() {

    }

    async all(user_id) {
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

    async update(cashier) {
        let cashier_data = await this.find();
        let sql = "update cashiers set updated_at = datetime('now', 'localtime'), money = ?, debit = ?, credit = ?, ticket = ? where id = ?";
        db.run(sql, [cashier[0],cashier[1],cashier[2],cashier[3], cashier_data.id], err => {
            if (err) {
                return console.log(err);
            }
        });
    }

    async create(user) {
        let sql = "INSERT INTO cashiers (created_at, user_id)values(datetime('now', 'localtime'), ?)";
        db.run(sql,[user.id]);
    }

    async isOpened(){
        let isOpened = false
        await this.find().then((result)=>{
            if(result.id){
                isOpened = true
            }
        });

        return isOpened;
    }

    async find() {
        let sql = "select * from cashiers where updated_at ISNULL";
        let result = await db.get(sql);
        if (result) {
            return result
        }else{
            return result =  {
                debit: "0,00",
                credit: "0,00",
                ticket: "0,00",
                moneyamount: "0,00"
              }
        }
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
        let sql = "select u.id, u.name from cashiers c2 join users u on u.id = c2.user_id where c2.updated_at ISNULL";
        let result = await db.get(sql);
        if (result) {
            return result
        }else{
            return false
        }
    }
}