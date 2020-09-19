import { resolve } from "path";
import sqlite3 from "sqlite3";
import bcryptjs from 'bcryptjs'
import {Helper} from './Helper'
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

    async find(id){
        let resolved = false
        let sql = "select * from users where remote_id = " + id;
        let result = await db.get(sql);

        if(result){
            resolved = true
        }else{
            resolved = false
        }
        return resolved
    }

    async all() {
        let sql = "select * from users;";
        let users = await db.all(sql);
        return users
    }

    async create(users){
        let res = await helper.insertMany('users', users);
        console.log(res)
    }

    async count(){
        let sql = "select count(*) as quantidade from users";

        let result = await db.get(sql);

        return result.quantidade;
    }

    resetPassword(u) {
        let sql = "update users set updated_at = NULL where id = ?";
        db.run(sql, [u.id]);
    }

    async update(u) {
        let resolved = false;
        let sql = "update users set name = ?, phone = ?, role = ?, password = ?, updated_at = ? where remote_id = ?"
        let response = db.run(sql, [u.name, u.phone, u.role, u.password, u.updated_at, u.id]);

        await response.then(() => {
            resolved = true;
        }).catch((error) => {
            resolved = false;
        })

        console.log(resolved)

        return resolved;
    }

    async auth(user, password) {
        let sql = "select * from users where phone = ?";
        let result = await db.get(sql, [user]);

        if (result) {
            return result
        } else {
            return false;
        }

    }

}
