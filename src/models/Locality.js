import sqlite3 from "sqlite3";
import util from 'util'
import { Helper } from "./Helper";
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.all = util.promisify(db.all);
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);

const helper = new Helper();

export class Locality {
    constructor(){

    }
    
    async all() {
        let sql = "select * from localities";
        let localities = await db.all(sql);

        return localities;
    }

    async find(id) {
        let sql = "select * from localities where id = " + id;

        let result = await db.get(sql);

        return result
    }

    async create(localities){
        let res = await helper.insertMany('localities', localities);
    }

    async count(){
        let sql = "select count(*) as quantidade from localities";

        let result = await db.get(sql);

        return result.quantidade;
    }
}