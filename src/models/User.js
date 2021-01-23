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
     * @param {*} email_phone 
     * @param {*} password
     * check users autenticity 
     */
    async auth(email_phone, password) {
        let sql = "select * from users where phone = '" + email_phone + "' OR email = '" + email_phone + "';";
        let user = await db.select(table, sql);

        if(user.length == 0){
            return false;
        }
        return new Promise(function(resolve, reject){
            bcrypt.compare(password, user[0].password.replace('$2y$', '$2a$'), (err, result)=>{
                if(err){
                    reject(err)
                }else{
                    localStorage.setItem('logged_user', JSON.stringify(user[0]))
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
