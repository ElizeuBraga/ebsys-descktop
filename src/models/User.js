import { resolve } from "path";
import sqlite3 from "sqlite3";
import bcryptjs from 'bcryptjs'
const util    = require('util');

const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
bcryptjs.compare = util.promisify(bcryptjs.compare)

export class User{
    constructor(){
        let user = {}
        let hashed = null
    }

    async create(u){
        var password = null;
        bcryptjs.genSalt(10, async (err, salt) => {
            await bcryptjs.hash('12345', salt, (err, hash) => {
                // Store hash in your password DB.
                let resolved = false;
                let sql = "insert into users (name,phone,password, role_type, created_at)values(?,?,?,?, datetime('now', 'localtime'))";
                let response = db.run(sql, [u.name, u.phone, hash, u.role_type]);

                response.then(()=>{
                    console.log('Rsolved')
                    resolved = true;
                }).catch((error)=>{
                    console.log(error)
                    console.log('Erro')
                    resolved = error.errno
                })
                return resolved
                
            });
        });
    
    }

    async update(u){
        
        bcryptjs.genSalt(10, async (err, salt) => {
            await bcryptjs.hash(u.password, salt, (err, hash) => {
                // Store hash in your password DB.
                let resolved = false;
                let sql = "update users set password = ?, updated_at = datetime('now', 'localtime') where id = ?";
                let response = db.run(sql, [hash, u.id]);
                
                response.then(()=>{
                    console.log('Rsolved')
                    resolved = true;
                }).catch((error)=>{
                    console.log(error)
                    console.log('Erro')
                    resolved = error.errno
                })
                return resolved
                
            });
        });
    }

    async auth(user, password){
        let sql = "select * from users where phone = ?";
        let result = await db.get(sql, [user]);

        return result;

    }

}
