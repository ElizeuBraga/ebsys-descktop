import { DocDB } from "aws-sdk";
import { resolve } from "path";
import sqlite3 from "sqlite3";
import { Helper } from "./Helper";
const util    = require('util');

const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.run = util.promisify(db.run);
db.all = util.promisify(db.all);

const helper = new Helper();

export class Section{
    async all(){
        let sql = 'select * from sections order by id';
        let result = db.all(sql);

        return result
    }

    async create(sections){
        let result = await helper.insertMany('sections', sections)
    }
}
