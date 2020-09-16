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

    async create(products) {
        let qtdLocal = await this.count();
        if(qtdLocal < products.length){
            console.log('Atualizo')
            await products.forEach(async e => { 
                let sql = "insert into products (id, name, price, section_id, created_at, updated_at, deleted_at)values(?, ?, ?,?,?,?,?)";
                await db.run(sql, [e.id, e.name, e.price, e.section_id, e.created_at, e.updated_at, e.deleted_at]).then(()=>{
                    
                }).catch((err)=>{
                    
                });
            });

            db.close();
        }
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