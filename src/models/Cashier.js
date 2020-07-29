import sqlite3 from "sqlite3";
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);
export class Cashier {
    constructor() {

    }

    async all() {

    }

    async create() {
        let sql = "insert into cashiers (opened_at)values(date('now'))";
        db.run(sql, err => {
            if (err) {
                return console.log(err);
            }
        });
    }

    find() {
        let result = null;
        let sql = "select * from cashiers c where opened_at = date('now') and closed_at ISNULL;";
        db.get(sql, (err, row) => {
            if (err) {
                return console.log(err);
            }
            if (row) {
                result = row.id
                console.log("Caixa aberto")

                return
            }

            console.log('Caixa fechado')
        });
    }
}