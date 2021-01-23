import bcrypt from 'bcrypt'
import { Helper } from './Helper'
import { DB } from './DB'
const util = require('util');

const helper = new Helper();
const db = new DB();
const table = 'users';

export class User {
    constructor() {
        
    }

    async count() {
        
    }

    async find(username) {
        
    }

    async all() {
        
    }

    async create(users) {
        db.insert(users)
    }

    async count() {
        
    }

    activeResetPassword(id) {
        
    }

    async update() {
        
    }

    /**
     * 
     * @param {*} user 
     * @param {*} password
     * check users autenticity 
     */
    async auth(user, password) {
        let sql = "select * from users where phone = '" + user + "' OR email = '" + user + "';";
        let result = await db.select(table, sql);

        if(result.length == 0){
            return false;
        }
        return new Promise(function(resolve, reject){
            bcrypt.compare(password, result[0].password.replace('$2y$', '$2a$'), (err, result)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result);
                }
            });
        });
    }

    resetPassword(password, user_id) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        var new_password = hash

        let sql = "UPDATE users SET password = '" + new_password + "', change_password = false WHERE id = " + user_id;

        db.run(sql);
    }

}
