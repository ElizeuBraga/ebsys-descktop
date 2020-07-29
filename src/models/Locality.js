import sqlite3 from "sqlite3";
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);
export class Locality {
    constructor(){

    }
    
    async all() {
        let localities = []
        let sql = "select * from locality";
        db.all(sql, (err, rows) => {
            if (err) {
                return console.log(err);
            }
            rows.forEach(row => {
                localities.push(row);
            });
        });

        return localities;
    }

    find(id) {

    }
}