import { DB } from "./DB";
import { Helper } from "./Helper";

const helper = new Helper();
const db = new DB();
const table = 'products'
export class Product {
    constructor() {
    }

    async get(){
        return await db.select(table);
    }

    async findByLocalityPhone(phone){
        let sql = `SELECT 
                    p.*
                FROM products p
            JOIN cities c ON c.product_id = p.id
            JOIN adresses a ON a.city_id = c.id
            JOIN customers c2 ON c2.id = a.customer_id
            WHERE phone = '${phone}';`

        let product = await db.selectOne(sql);

        return product;
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
        let sql = "update products set name = ? , price = ? where id = " + p.id;
        let resp = db.run(sql, [p.name, p.price]);
    }

    async create(products) {
        let res = await helper.insertMany('products', products);
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

    async selectProdutcToCart(name){
        let sql = `SELECT * FROM ${table} WHERE name like '%${name}%' LIMIT 20`;

        return await db.select(sql);
    }
}