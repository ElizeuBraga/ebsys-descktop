import { count } from "console";
import { resolve } from "path";
import { stringify } from "querystring";
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

    formatMonetaryForDB(value){
        let result = null;
        if(this.isString(value)){
            result = value.replace('.', '').replace(',', '.')  
        }else if (this.isFloat(value)) {
            result = value.toFixed(2)  
        }else{
            result = parseFloat(value).toFixed(2)
        }
        return result
    }

    isString (value) {
        return typeof value === 'string' || value instanceof String;
    }

    isFloat(n){
        return Number(n) === n && n % 1 !== 0;
    }

    async insertMany(table, array){
        let resolved = false;
        if (array.length > 0) {   
            let columns = []
            
            // get columns of a table
            let sqlinfotable = "PRAGMA table_info("+table+")";        
            await db.all(sqlinfotable).then(async (cols)=>{
                if(cols.length > 0){
                    for(let c of cols){
                        const todo = await fetch(c);
                        columns.push(c.name)
                    }
                }else{
                    console.log(table + ' não existe')
                }
            }).catch((e)=>{
                console.log(e)
            });
            
            // compare if table keys is equals array keys
            if(stringify(Object.keys(array[0])) !== stringify(columns)){
                console.log('Dados não petencem a ' + table)
                return
            }
            
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
                    map += (typeof e[c] == 'string') ? "'" +e[c]+ "'" + separator : (countcols == 1) ? "(" + e[c] + separator: e[c] + separator;
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
