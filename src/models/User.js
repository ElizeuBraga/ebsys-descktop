import sqlite3 from "sqlite3";
import bcryptjs from 'bcryptjs'
import { Helper } from './Helper'
import { DB } from './DB'
const util = require('util');

bcryptjs.compare = util.promisify(bcryptjs.compare)

const helper = new Helper();
const db = new DB();
// db.run = util.promisify(db.run);
// db.get = util.promisify(db.get);
// db.all = util.promisify(db.all);

export class User {
    constructor() {
        let user = {}
        let hashed = null
    }

    async count() {
        let sql = "select COUNT(*) as quantity from users";

        return
        let result = await db.get(sql);

        return result;
    }

    async find(username) {
        return
        let sql = "select * from users where phone = '" + username + "' OR email = '" + username + "';";
        let result = await db.get(sql);

        return result
    }

    async all() {
        let sql = "select * from users;";
        let users = await db.all(sql);
        return users
    }

    async create(users) {
        db.insert(users)
    }

    async count() {
        let sql = "select count(*) as quantidade from users";

        return
        let result = await db.get(sql);

        return result.quantidade;
    }

    activeResetPassword(id) {
        let sql = "update users set change_password = true where id = " + id;

        db.run(sql);
    }

    async update(u, resetpwd = false) {
        var today = new Date();
        let resolved = false;
        if (resetpwd) {
            var salt = bcryptjs.genSaltSync(10);
            var hash = bcryptjs.hashSync(u.password, salt);
            u.password = hash
            u.change_password = false
        }

        let sql = "update users set name = ?, phone = ?, role = ?, password = ?, change_password = ?, updated_at = datetime('now', 'localtime') where id = ?"
        let response = db.run(sql, [u.name, u.phone, u.role, hash, u.change_password, u.id]);

        await response.then(() => {
            resolved = true;
        }).catch((error) => {
            resolved = false;
        })

        return resolved;
    }

    async auth(user, password) {
        let auth = false;
        let sql = "select * from users where phone = '" + user + "' OR email = '" + user + "';";
        let result = await db.get(sql);

        if(result){
            auth = await bcryptjs.compareSync(password, result.password);
            if(auth){
                return result
            }else{
                return false;
            }
        }else{
            return auth;
        }


    }

    resetPassword(password, user_id) {
        var salt = bcryptjs.genSaltSync(10);
        var hash = bcryptjs.hashSync(password, salt);
        var new_password = hash

        let sql = "UPDATE users SET password = '" + new_password + "', change_password = false WHERE id = " + user_id;

        db.run(sql);
    }

}
