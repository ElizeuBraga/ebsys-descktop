import sqlite3 from "sqlite3";
import {ItemController} from '../controllers/ItemController'
import {PaymentController} from '../controllers/PaymentController'
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);
export class Order {
    constructor() {

    }

    async all() {

    }

    async create(o, i, p) {
        let sql = "insert into orders (cashier_id, customer_id, order_type, created_at) values(?, ?, ?, datetime('now', 'localtime'));";
        db.run(sql, [o.cashier_id, o.customer_id, o.order_type], function(err) {
            if (err) {
                return console.log(err.message);
            }
            
            let payment = new PaymentController();
            payment.store(p, this.lastID)

            let item = new ItemController();
            item.store(i, this.lastID);

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