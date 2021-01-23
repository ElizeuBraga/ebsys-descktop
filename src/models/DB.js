import mysql from 'mysql';
var con = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '@Ae12345678',
    database: "ebsys_descktop"
  });
export class DB{
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

    async select(table, query = false){
        let sql = ""
        if(query){
            sql = query;
        }else{
            sql = "SELECT * FROM " + table
        }

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
}