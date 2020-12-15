import sqlite3 from "sqlite3";
const util    = require('util');

const db = new sqlite3.Database(window.process.env.APP_DATABASE_URL);

db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
export class Customer{

    async create(c){
        let resolved = false;
        let sql = "insert into customers (name,address,phone,locality_id)values(?,?,?,?)";
        let response = db.run(sql, [c.name, c.address, c.phone, c.locality_id]);

        await response.then(()=>{
            resolved = true;
        }).catch((error)=>{
            resolved = error.errno
        })

        return resolved
    }

    async find(phone){
        let sql = "select * from customers where phone = ?";
        let response = await db.get(sql, [phone]);

        return response;
    }

    async update(customer){
        let resolved = false;
        let sql = "UPDATE customers SET name = ? ,address = ?, phone = ?, locality_id = ? where phone = ?";

        await db.run(sql, [customer.name, customer.address, customer.phone, customer.locality_id, customer.phone]).then(()=>{
            resolved = true
        })

        return resolved;
    }
}