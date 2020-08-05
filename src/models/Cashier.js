import { userInfo } from "os";
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

    remove_character(str, char_pos) 
    {
        let part1 = str.substring(0, char_pos);
        let part2 = str.substring(char_pos + 1, str.length);
        return (part1 + part2);
    }

    async update(cashier) {
        let r1 =  cashier.money.replace(',', '.')
        let r2 = cashier.debit.replace(',', '.')
        let r3 = cashier.credit.replace(',', '.')
        let r4 = cashier.ticket.replace(',', '.')

        if(r1.length == 8){
            r1 = this.remove_character(r1, 1)
        }
        if(r2.length == 8){
            r2 = this.remove_character(r2, 1)
        }
        if(r3.length == 8){
            r3 = this.remove_character(r3, 1)
        }
        if(r4.length == 8){
            r4 = this.remove_character(r4, 1)
        }

        let sql = "update cashiers set updated_at = datetime('now', 'localtime'), money = ?, credit = ?, debit = ?, ticket = ? where id = ?";
        db.run(sql, [r1, r2, r3, r4 , cashier.id], err => {
            if (err) {
                return console.log(err);
            }
        });
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
        let sql = "select * from cashiers where updated_at ISNULL";
        let result = await db.get(sql);
        if (result) {
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

    async checkUserOpenedCashier(){
        let sql = "select u.id, u.name from cashiers c2 join users u on u.id = c2.user_id where c2.updated_at ISNULL";
        let result = await db.get(sql);
        if (result) {
            return result
        }else{
            return false
        }
    }
}