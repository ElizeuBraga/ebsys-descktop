import sqlite3 from "sqlite3";
import util from 'util'
import { brotliDecompress } from "zlib";
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);
export class Product {
    constructor() {

    }

    async find(id){
        let resolved = false;
        let sql = "SELECT * FROM products where remote_id = " + id;
        let response = await db.get(sql);

        if(response){
            resolved = true
        }else{
            resolved = false
        }
        return resolved
    }

    async update(p) {
        let sql = "update products set name = ? , price = ? , section_id = ?, updated_at = ? where remote_id = " + p.id;
        let resp = db.run(sql, [p.name, p.price, p.section_id, p.updated_at]);
    }

    async create(p) {
        let resolved = false;
        let sql = "insert into products (name, remote_id, price,section_id, created_at)values(?,?,?,?,?)";
        let response = db.run(sql, [p.name, p.id, p.price, p.section_id, p.created_at]);

        await response.then(() => {
            resolved = true;
        }).catch((error) => {
            resolved = false
        })

        return resolved
    }

    async all() {
        let sql = "select * from products order by id";
        let products = await db.all(sql);
        return products;
    }

    async findByLocality(id) {
        let sql = "select p.*, l.id as locality_id from products p join localities l on l.product_id = p.id where l.id = ?";

        let product = await db.get(sql, [id]);

        return product;
    }

    dontAskAgain(id) {
        console.log(id)
        let sql = 'UPDATE products set ask_obs = false where id = ?'
        db.run(sql, [id]);
    }
}