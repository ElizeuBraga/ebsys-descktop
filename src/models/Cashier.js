import sqlite3 from "sqlite3";
const util    = require('util');

const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);
db.get = util.promisify(db.get);

export class Cashier {
    constructor() {

    }

    async all() {

    }

    async update() {
        let sql = "update cashiers set closed_at = datetime('now', 'localtime') where id = " + parseInt(localStorage.getItem('cashier_id'));
        db.run(sql, err => {
            if (err) {
                return console.log(err);
            }
        });

        console.log('Caixa fechado')
    }

    async create() {
        let sql = "insert into cashiers (opened_at)values(datetime('now', 'localtime'))";
        db.run(sql, err => {
            if (err) {
                return console.log(err);
            }
        });
    }

    async find() {
        let sql = "select * from cashiers where date(opened_at) = date('now', 'localtime') and closed_at ISNULL";
        let result = await db.get(sql);
        if (result) {
            localStorage.setItem('cashier_id', result.id)
            return true
        }else{
            return false
        }
    }
}