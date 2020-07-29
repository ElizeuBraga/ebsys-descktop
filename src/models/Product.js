import sqlite3 from "sqlite3";
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);
export class Product {
    constructor(){

    }
    
    async all() {
        let products = []
        let sql = "select * from products";
        db.all(sql, (err, rows) => {
            if (err) {
                return console.log(err);
            }
            rows.forEach(row => {
                products.push(row);
            });
        });

        return products;
    }

    find(id) {

    }
}