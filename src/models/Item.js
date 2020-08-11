import sqlite3 from "sqlite3";
import {Order} from '../models/Order'
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);
export class Item {
    constructor() {

    }

    async all() {

    }

    async create(items, order_id) {
        let sql3 = "INSERT INTO items(quantity, price, product_id, order_id, created_at)values(?, ?, ?, ?, datetime('now', 'localtime'));";
    
        items.forEach(i => {
            db.run(sql3, [i.quantity, i.price, i.id, order_id], err => {
                if (err) {
                    let order = new Order();
                    order.destroy(order_id)
                    return console.log(err);
                }
            });
        });
    }

    find(id) {

    }
}