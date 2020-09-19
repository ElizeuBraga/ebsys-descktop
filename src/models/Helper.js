import { count } from "console";
import { resolve } from "path";
import sqlite3 from "sqlite3";
const util    = require('util');

const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.run = util.promisify(db.run);
db.all = util.promisify(db.all);
db.get = util.promisify(db.get);

export class Helper{
    async max(table){
        let sql = 'select case when max(id) is null then 0 else max(id) end as "max" from ' + table;

        let result = await db.get(sql);
        return result.max
    }

    async insertMany(table, array){
        let resolved = false;
        let columns = []
        let sqlinfotable = "PRAGMA table_info("+table+")";
        await db.all(sqlinfotable).then((cols)=>{
            if(cols.length > 0){
                columns = cols
            }else{
                console.log(table + ' não existe')
            }
        }).catch((e)=>{
            console.log(e)
        });
        if (columns.length > 0 && array.length > 0) {
            let countcols = 0;
            let countelements = 0;
            let separator = ",";
            let map = "";
            for (let e of array) {
                const todo = await fetch(e);
                countelements += 1
                countcols = 0;
                for (let c of columns) {
                    const todo = await fetch(c);
                    countcols += 1;
                    (countcols == columns.length) ? separator = ")," : separator =  ",";
    
                    if (countelements == array.length && countcols == columns.length) {
                        separator = ");"
                    }
                    map += (typeof e[c.name] == 'string') ? "'" +e[c.name]+ "'" + separator : (countcols == 1) ? "(" + e[c.name] + separator: e[c.name] + separator;
                }
            }
    
            let sql = 'INSERT INTO '+ table +' values' + map;
    
            await db.run(sql).then(()=>{
                resolved = true
            }).catch((err)=>{
                console.log(err)
            })
        }

        return resolved
    }
}
