import { count } from "console";
import { resolve } from "path";
import { stringify } from "querystring";
import sqlite3 from "sqlite3";

// import {Product} from './Product';
const util = require('util');

const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.run = util.promisify(db.run);
db.all = util.promisify(db.all);
db.get = util.promisify(db.get);

// const product = new Product();

export class Helper {
    async max(table) {
        let sql = 'select case when max(id) is null then 0 else max(id) end as "max" from ' + table;

        let result = await db.get(sql);
        return result.max
    }

    formatMonetaryForDB(value) {
        let result = null;
        if (this.isString(value)) {
            result = value.replace('.', '').replace(',', '.')
        } else if (this.isFloat(value)) {
            result = value.toFixed(2)
        } else {
            result = parseFloat(value).toFixed(2)
        }
        return result
    }

    isString(value) {
        return typeof value === 'string' || value instanceof String;
    }

    isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
    }

    inputMask(value) {
        let withoutDot = value.replace(".", "");
        let firstPart = withoutDot.slice(0, withoutDot.length - 2);
        let endPart = withoutDot.slice(withoutDot.length - 2);
        var output = [firstPart, ".", endPart].join("");

        // if (withoutDot.length > 0) {
        //     input.value = output;
        // }

        return output;
    }

    async insertMany(table, data) {
        console.log('Inserting or updating data in '+ table)
        // check if table exists
        // ------------------------------------------------------------------------------------------------------------
        let sqlTable = "PRAGMA table_info(" + table + ")";
        let exists = false;
        await db.all(sqlTable).then(async (cols) => {
            if (cols.length > 0) {
                exists = true
            }
        }).catch((e) => {
            console.log(e)
        });

        if(!exists){
            console.log('Table ' + table + ' not exists');
            return;
        }else if(data.length == 0){
            console.log('Not data for insert or update on ' + table);
            return;
        }
        // ------------------------------------------------------------------------------------------------------------

        let array = []
        for (let d of data) {
            const todo = await fetch(d);
            // if data is in database update else insert in array for insert
            await db.get('SELECT * FROM ' + table +' WHERE id = ' + d.id).then(async (d2)=>{
                if(d2){
                    // await product.update(p)
                    let sql = "";
                    if(table == 'products'){
                        sql = "UPDATE " + table + " SET name = '" + d.name + "', price = " + d.price + " WHERE id = " + d.id;
                    }else if(table == 'users'){
                        sql = "UPDATE " + table + 
                        " SET name = '" + d.name +
                        "', email = '" + d.email +
                        "', phone = '" + d.phone +
                        "', password = '" + d.password +
                        "', change_password = '" + d.change_password +
                        "' WHERE id = " + d.id;
                    }else if(table == 'localities'){
                        sql = "UPDATE " + table + " SET name = '" + d.name + "', product_id = " + d.product_id + " WHERE id = " + d.id;
                    }

                    if(sql != ""){
                        await db.run(sql);
                        console.log('Updated')
                    }

                    // console.log(table + ' of id ' + d.id + ' updated')

                }else{
                    array.push(d)
                }
            })
        }

        let resolved = false;
        if (array.length > 0) {
            let columns = []
            // get columns of a table
            let sqlinfotable = "PRAGMA table_info(" + table + ")";
            await db.all(sqlinfotable).then(async (cols) => {
                if (cols.length > 0) {
                    for (let c of cols) {
                        const todo = await fetch(c);
                        columns.push(c.name)
                    }
                } else {
                    console.log(table + ' not exists')
                    return;
                    console.log('Oi')
                }
            }).catch((e) => {
                console.log(e)
            });

            // compare if table keys is equals array keys
            if (stringify(Object.keys(array[0])) !== stringify(columns)) {
                console.log('Data not owned to ' + table)
                return
            }


            // create a sql for insert
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
                    (countcols == columns.length) ? separator = ")," : separator = ",";

                    if (countelements == array.length && countcols == columns.length) {
                        separator = ");"
                    }
                    map += (typeof e[c] == 'string') ? "'" + e[c] + "'" + separator : (countcols == 1) ? "(" + e[c] + separator : e[c] + separator;
                }
            }

            let sql = 'INSERT INTO ' + table + ' values' + map;

            let sql_log_errors = "INSERT INTO logs_errors values(?,?,?, datetime('now', 'localtime'))"
            await db.run(sql).then(() => {
                resolved = true
                console.log(table + ' is now in database')
            }).catch((err) => {
                db.run(sql_log_errors, [err, table, 'create'])
                console.log(err)
            })

        }

        console.log('------------------------------------------------')
        return resolved
    }
}
