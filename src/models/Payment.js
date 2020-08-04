import { decodeBase64 } from "bcryptjs";

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);
export class Payment{
    constructor(){

    }

    create(payments, order_id){
        let sql = "INSERT INTO payments(price, order_id, payment_type, created_at)values(?,?, ?, datetime('now', 'localtime'))";
        payments.forEach(e => {
            db.run(sql, [e.price, order_id, e.payment_type], err =>{
                if(err){
                    return console.log(err)
                }
            });        
        });
    }
}