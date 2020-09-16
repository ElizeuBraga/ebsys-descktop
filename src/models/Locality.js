import sqlite3 from "sqlite3";
import util from 'util'
const db = new sqlite3.Database(
    "/home/basis/Downloads/app-descktop/src/database/database.db"
);

db.all = util.promisify(db.all);
db.run = util.promisify(db.run);

export class Locality {
    constructor(){

    }
    
    async all() {
        let sql = "select * from localities";
        let localities = await db.all(sql);

        return localities;
    }

    find(id) {

    }

    async create(localities){
        let qtdLocal = await this.count();
        if(qtdLocal < localities.length){
            await localities.forEach(async e => { 
                let sql = "insert into localities (id, name, product_id, created_at, updated_at, deleted_at)values(?, ?, ?,?,?,?)";
                await db.run(sql, [e.id, e.name, e.product_id, e.created_at, e.updated_at, e.deleted_at]).then(()=>{
                    
                }).catch((err)=>{
                    
                });
            });

            db.close();
        }
    }

    async count(){
        let sql = "select count(*) as quantidade from localities";

        let result = await db.get(sql);

        return result.quantidade;
    }
}