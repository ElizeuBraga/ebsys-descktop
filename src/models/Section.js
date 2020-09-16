import { DocDB } from "aws-sdk";
import { resolve } from "path";
import sqlite3 from "sqlite3";
const util    = require('util');

const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.run = util.promisify(db.run);
db.all = util.promisify(db.all);

export class Section{
    async all(){
        let sql = 'select * from sections order by id';
        let result = db.all(sql);

        return result
    }

    async create(sections){
        let sectionsLocal = await this.all();
        if(sectionsLocal.length < sections.length){
            await sections.forEach(async e => {
                let sql = 'INSERT INTO sections(id, name) VALUES (?, ?)';    
                await db.run(sql, [e.id, e.name]).then(()=>{

                }).catch((err)=>{
                    
                });
            })
            db.close();   
        }
    }
}
