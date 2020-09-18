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

    async sql(table, array){
        let map = '';
        let row = '';
        let count = 0;
        let sql = '';

        console.log('STARTED');
        let updated_at = null;
        let deleted_at = null;
        for (let e of array) {
            const todo = await fetch(e);
            count += 1;
            updated_at = (e.updated_at == null) ? null : "'"+e.updated_at+"'";
            deleted_at = (e.deleted_at == null) ? null : "'"+e.deleted_at+"'";
            let separator = (count == array.length) ? ");" : "),";
            if (table == 'products') {
                row = "("+e.id+",'"+e.name+"',"+e.price+","+e.section_id+",'"+e.created_at+"',"+updated_at+","+deleted_at + separator;
            }else if (table == 'sections') {
                row = "("+e.id+",'"+e.name+"','"+e.created_at+"',"+updated_at+","+deleted_at + separator;
            }
            map += row;
        }
          console.log('FINISHED');

        if (table == 'products') {
            sql = 'INSERT INTO products (id, name, price, section_id, created_at, updated_at, deleted_at)values' + map;
        }else if (table == 'sections') {
            sql = 'INSERT INTO sections(id, name, created_at, updated_at, deleted_at)values' + map;
        }

        return sql;
    }
}
