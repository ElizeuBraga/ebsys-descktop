import sqlite3 from "sqlite3";
import {ItemController} from '../controllers/ItemController'
import {PaymentController} from '../controllers/PaymentController'
import util from 'util'
import { stringify } from "querystring";
import { Helper } from "./Helper";
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
    );
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);

const helper = new Helper();
export class Order {
    constructor() {

    }

    async all() {

    }

    async create(o) {
        console.log(o)
        let customer_id = null
        let item = {}
        let items =[]
        let sql = "insert into orders (cashier_id, customer_id, money, debit, credit, ticket, order_type, created_at) values(?, ?, ?, ?, ?, ?, ?,  datetime('now', 'localtime'));";
        
        
        // db.run('BEGIN TRANSACTION');
        await db.run(sql, [o.cashier_id, customer_id, o.money, o.debit, o.credit, o.ticket, o.order_type]).then(async ()=>{
            let sqlLastRowId = "SELECT LAST_INSERT_ROWID() as order_id";
            let order_id = await db.get(sqlLastRowId)
            for (const i of o.items) {
                let todo = await fetch(i)
                item.id = null
                item.quantity = i.quantity
                item.product_id = i.id
                item.price = i.price
                item.order_id = order_id.order_id
                item.created_at =  new Date().toISOString();
                item.updated_at = null
                item.deleted_at = null
                
                let itemCopy = Object.assign({}, item)
                items.push(itemCopy)
            }
            
        
            await helper.insertMany('items', items)
        })
        // db.run('COMMIT');
        
        console.log(o)
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