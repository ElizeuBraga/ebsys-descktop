import { decodeBase64 } from "bcryptjs";

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);
export class Payment{
    constructor(){

    }

    create(payments, order_id){
        let sql = "INSERT INTO payments(price, order_id)values(?,?)";
        payments.forEach(e => {
            db.run(sql, [e.price, order_id], err =>{
                if(err){
                    return console.log(err)
                }

                console.log('Pagamento inserido')
            });        
        });
    }
}