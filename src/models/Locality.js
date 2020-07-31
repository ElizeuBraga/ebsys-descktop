import sqlite3 from "sqlite3";
import util from 'util'
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.all = util.promisify(db.all);

export class Locality {
    constructor(){

    }
    
    async all() {
        let sql = "select * from localities";
        let localities = await db.all(sql);

        return localities;
    }

    find(id) {

    }
}