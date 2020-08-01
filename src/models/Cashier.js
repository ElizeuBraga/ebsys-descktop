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

    async update(cashier) {
        let r1 =  cashier.money.replace(',', ',')
        let r2 = cashier.debit.replace(',', ',')
        let r3 = cashier.credit.replace(',', ',')
        let r4 = cashier.ticket.replace(',', ',')

        let sql = "update cashiers set updated_at = datetime('now', 'localtime'), money = ?, credit = ?, debit = ?, ticket = ? where id = ?";
        db.run(sql, [r1, r2, r3, r4 , cashier.id], err => {
            if (err) {
                return console.log(err);
            }
        });

        console.log('Caixa fechado')
    }

    async create(loggedUser) {
        let sql = "insert into cashiers (created_at, user_id)values(datetime('now', 'localtime'), ?)";
        db.run(sql, [loggedUser.id], err => {
            if (err) {
                return console.log(err);
            }
        });
    }

    async find() {
        let sql = "select * from cashiers where date(created_at) = date('now', 'localtime') and updated_at ISNULL";
        let result = await db.get(sql);
        if (result) {
            console.log('existe')
            return result
        }else{
            return result =  {
                debit: "0,00",
                credit: "0,00",
                ticket: "0,00",
                moneyamount: "0,00"
              }
        }
    }
}