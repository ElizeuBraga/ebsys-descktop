import mysql from 'mysql';
var con = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '@Ae12345678',
    database: "ebsys_descktop"
  });
export class DB{
    async update(table, array){
        this.execute('BEGIN;');
        for await (const [i, a] of array.entries()) {
            let keys = Object.keys(a);
            let values = Object.values(a);
            let sql = "UPDATE " + table + " SET ";
            let map = ""

            let count = 1;
            for await (const [j, k] of keys.entries()) {
                if(keys[j] != 'id' && values[j] != null){
                    let final = ((keys[j] == 'updated_at') ? "":", ");
                    map += keys[j] + " = '" + values[j] + "'" + final  
                }
            }

            let updated_at = "";
            if(!keys.includes('updated_at')){
                updated_at = " updated_at = NOW()"
            }
            sql += map + updated_at + " WHERE id = " + a.id

            console.log(sql)
            // await this.execute(sql);
        }

        this.execute('COMMIT;');

        return true;
    }

    async insert(table, items){
        let values = "";
        for await (let [i, a] of items.entries()) {
            // const todo = await fetch(a);
            let keys = JSON.stringify(Object.values(a)).replace('[', '(');
            keys = keys.replace(/"/gi, "'");
            values += keys.replace(']', ')') + ((i == items.length - 1) ? "":",")
        }

        let sql = "INSERT INTO "+table+"("+Object.keys(items[0])+") values "+values;

        return new Promise(function(resolve, reject){
            con.query(sql, (err, result) => {
                if(err){
                    console.log(err)
                }else{
                    // let sql = `INSERT INTO updateds(table_name, made_in)VALUES(${table}, 'local')`;
                    // this.execute(sql);
                    // console.log('Insert successfull')
                    resolve(result.insertId)
                    // resolve(true)
                }
            });
        });
    }

    async getLastId(table){
        let sql = "SELECT CASE WHEN MAX(id) IS NULL THEN 0 ELSE MAX(id) END AS lastId FROM " + table
        return new Promise(function(resolve, reject){
            con.query(sql, async (err, result) => {
                if(err){
                    console.log(err)
                }else{
                    resolve(result[0].lastId);
                }
            })
        });
    }

    async getLastDate(table){
        let sql = "SELECT CASE WHEN MAX(updated_at) IS NULL THEN false ELSE MAX(updated_at) END AS lastDate FROM " + table

        return await this.selectOne(sql);
    }

    async select(sql){
        return new Promise(function(resolve, reject){
            con.query(sql, async (err, result) => {
                if(err){
                    console.log(err)
                }else{
                    if(result.length > 0){
                        resolve(result);
                    }

                    resolve(false);
                }
            })
        });
    }

    async selectOne(sql){
        return new Promise(function(resolve, reject){
            con.query(sql, async (err, result) => {
                if(err){
                    console.log(err)
                }else{
                    if(result.length > 0){
                        if(result.length == 1){
                            resolve(result[0])
                        }
                        resolve(result);
                    }

                    resolve(false);
                }
            })
        });
    }

    async selectMany(sql){
        return new Promise(function(resolve, reject){
            con.query(sql, async (err, result) => {
                if(err){
                    console.log(err)
                }else{
                    if(result.length > 0){
                        resolve(result);
                    }

                    resolve(false);
                }
            })
        });
    }

    async execute(sql){
        return new Promise(function(resolve, reject){
            con.query(sql, function(err, result) {
                if(err){
                    console.log(err)
                    resolve(false)
                }
                resolve(true)
            });
        })
    }
    }