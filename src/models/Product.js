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

    async update(data) {
        let products = await this.all();
        if(data.length > products.length){
            let local = products.length
            let add = 0
            while (local < data.length) {
                await this.create(data[local])
                local ++;
                add ++;
                console.log(local)
            }

        }

        products = await this.all();
        let sql = "update products set name = ? , price = ? , section_id = ?, updated_at = ? where id_remoto = ?";

        let updated = 0
        await products.forEach(async (p, i) => {
            if ((p.name != data[i].name) || (p.price != data[i].price)) {
                updated ++;
                await db.run(sql, [data[i].name, data[i].price, data[i].section_id, data[i].updated_at, data[i].id]);
            }
        });

    }

    async create(p) {
        let resolved = false;
        let sql = "insert into products (name, id_remoto, price,section_id, created_at)values(?,?,?,?,?)";
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