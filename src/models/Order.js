import sqlite3 from "sqlite3";
import {ItemController} from '../controllers/ItemController'
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);
export class Order {
    constructor() {

    }

    async all() {

    }

    async create(o, i) {
        console.log(o)
        let sql = "insert into orders (payment, created_at, cashier_id, order_type) values(?,datetime('now'),?, ?);";
        db.run(sql, [o.payment, o.cashier_id, o.order_type], function(err) {
            if (err) {
                return console.log(err.message);
            }
            
            let item = new ItemController();
            item.store(i, this.lastID)
        });
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