import { userInfo } from "os";
import sqlite3 from "sqlite3";

import { Helper } from "./Helper";
const util    = require('util');

const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.get = util.promisify(db.get);
db.run = util.promisify(db.run);

const helper = new Helper();

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
        let money = helper.formatMonetaryForDB(cashier.money)
        let credit = helper.formatMonetaryForDB(cashier.credit)
        let debit = helper.formatMonetaryForDB(cashier.debit)
        let ticket = helper.formatMonetaryForDB(cashier.ticket)

        let sql = "update cashiers set updated_at = datetime('now', 'localtime'), money = ?, credit = ?, debit = ?, ticket = ? where id = ?";
        db.run(sql, [money.replace(',', '.'), credit.replace(',', '.'), debit.replace(',', '.'), ticket.replace(',', '.'), cashier.id], err => {
            if (err) {
                return console.log(err);
            }
        });
    }

    async create(user) {
        let sql = "INSERT INTO cashiers (created_at, user_id)values(datetime('now', 'localtime'), ?)";
        db.run(sql,[user.id]);
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