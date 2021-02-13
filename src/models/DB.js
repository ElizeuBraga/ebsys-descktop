import mysql from 'mysql';
var con = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '@Ae12345678',
    database: "ebsys_descktop"
  });
export class DB{
    async update(table, array, id = 21){
        let sql = "UPDATE " + table;
        let map = " SET ";
        for (const [i, a] of array.entries()) {
            map += Object.keys(a)[0] + " = " + Object.values(a)[0] + ((i == array.length - 1) ? " ":", ")
        }

        map += " ,updated_at = now() WHERE id = " + id;

        sql += map

        let resp = await this.execute(sql)

        return resp;
    }

    async insert(table, items){
        console.log(items)
        let values = "";
        for (let [i, a] of items.entries()) {
            const todo = await fetch(a);
            let keys = JSON.stringify(Object.values(a)).replace('[', '(');
            keys = keys.replace(/"/gi, "'");
            values += keys.replace(']', ')') + ((i == items.length - 1) ? "":",")
        }

        let sql = "INSERT INTO "+table+"("+Object.keys(items[0])+") values "+values;

        con.query(sql, function(err, result) {
            if(err){
                console.log(err)
            }else{
                console.log('Insert successfull')
            }
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