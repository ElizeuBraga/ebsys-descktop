import { resolve } from "path";
import sqlite3 from "sqlite3";
import bcryptjs from 'bcryptjs'
import {Helper} from './Helper'
import { Athena } from "aws-sdk";
const util = require('util');

const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);
bcryptjs.compare = util.promisify(bcryptjs.compare)

const helper = new Helper();

export class User {
    constructor() {
        let user = {}
        let hashed = null
    }

    async find(username){
        let sql = "select * from users where phone = '" + username + "' OR email = '" + username+"';";
        let result = await db.get(sql);

        return result
    }

    async all() {
        let sql = "select * from users;";
        let users = await db.all(sql);
        return users
    }

    async create(users){
        let res = await helper.insertMany('users', users);
    }

    async count(){
        let sql = "select count(*) as quantidade from users";

        let result = await db.get(sql);

        return result.quantidade;
    }

    resetPassword(id) {
        let sql = "update users set change_password = true where id = " + id;

        db.run(sql);
    }

    async update(u, resetpwd = false) {
        var today = new Date();
        let resolved = false;
        if(resetpwd){
            var salt = bcryptjs.genSaltSync(10);
            var hash = bcryptjs.hashSync(u.password, salt);
            u.password = hash
            u.change_password = false
        }

        u.updated_at = new Date().toLocaleString().replace(/\//g,'-')

        let sql = "update users set name = ?, phone = ?, role = ?, password = ?, change_password = ?, updated_at = ? where id = ?"
        let response = db.run(sql, [u.name, u.phone, u.role, hash, u.change_password, u.updated_at, u.id]);

        await response.then(() => {
            resolved = true;
        }).catch((error) => {
            resolved = false;
        })

        console.log(resolved)

        return resolved;
    }

    async auth(user, password) {
        let sql = "select * from users where phone = '"+ user +"' OR email = '"+ user +"';";
        let result = await db.get(sql);

        let auth = await bcryptjs.compareSync(password, result.password);

        return auth;

    }

}
