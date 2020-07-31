import sqlite3 from "sqlite3";
import util from 'util'
import { brotliDecompress } from "zlib";
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
export class Product {
    constructor(){

    }

    async create(p){
        let resolved = false;
        let sql = "insert into products (name,price,section_id)values(?,?,?)";
        let response = db.run(sql, [p.name, p.price, p.section_id]);

        await response.then(()=>{
            resolved = true;
        }).catch((error)=>{
            resolved = error.errno
        })

        return resolved
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

    async findByLocality(id) {
        let sql = "select p.*, l.id as locality_id from products p join localities l on l.product_id = p.id where l.id = ?";

        let product = await db.get(sql, [id]);

        return product;
    }
}