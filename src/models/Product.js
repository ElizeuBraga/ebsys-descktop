import { Console } from "console";
import { stringify } from "querystring";
import sqlite3 from "sqlite3";
import util from 'util'
import { brotliDecompress } from "zlib";
import { Helper } from "./Helper";
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

const helper = new Helper();
export class Product {
    constructor() {

    }

    async find(id){
        let resolved = false;
        let sql = "SELECT * FROM products where id = " + id;
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

    async create(products) {
        let res = await helper.insertMany('products', products);
        console.log(res)
    }

    async count(){
        let sql = "select count(*) as quantidade from products";

        let result = await db.get(sql);

        return result.quantidade;
    }

    async all() {
        let sql = "select * from products order by id";
        let products = await db.all(sql);
        return products;
    }

    async deliveryRate(phone) {
        let sql = "select p.*, l.id as locality_id from products p join localities l on l.product_id = p.id join customers c on c.locality_id = l.id where c.phone = " + phone;

        let product = await db.get(sql);
        return product;
    }

    dontAskAgain(id) {
        console.log(id)
        let sql = 'UPDATE products set ask_obs = false where id = ?'
        db.run(sql, [id]);
    }
}