import sqlite3 from "sqlite3";
import {ItemController} from '../controllers/ItemController'
import {PaymentController} from '../controllers/PaymentController'
import util from 'util'
import { stringify } from "querystring";
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
    );
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
export class Order {
    constructor() {

    }

    async all() {

    }

    async create(o) {
        let customer_id = null
        let item = {}
        let items =[]
        let sql = "insert into orders (cashier_id, customer_id, order_type, created_at) values(?, ?, ?, datetime('now', 'localtime'));";
        
        
        // await db.run('BEGIN TRANSACTION'); 
        await db.run(sql, [o.cashier_id, customer_id, o.order_type]).then(async ()=>{
            let sqlLastRowId = "SELECT LAST_INSERT_ROWID()";

            let order_id = await db.get(sqlLastRowId)
            console.log(order_id)
            for (const i of o.items) {
                let todo = await fetch(i)
                item.quantity = i.quantity
                item.product_id = i.id
                item.price = i.price
                item.order_id = i.order_id
                
                items.push(stringify(item))
            }
            console.log('Feito')
        })

        // console.log(items)
        
        // console.log(o)
        if(Object.keys(o.customer).length > 0){
            customer_id = o.customer.id
        }
    }

    find(id) {

    }

    destroy(id){
        let sql = "DELETE FROM orders where id = ?";

        db.run(sql, [id], function(err) {
            if (err) {
                return console.log(err.message);
            }
        });
    }
}