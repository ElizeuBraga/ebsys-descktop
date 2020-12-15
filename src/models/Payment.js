import sqlite3 from "sqlite3";
const db = new sqlite3.Database(window.process.env.APP_DATABASE_URL);
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