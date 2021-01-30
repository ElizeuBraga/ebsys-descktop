import { Helper } from "./Helper";
import { DB } from "./DB";
const helper = new Helper();
const db = new DB();
const table = 'localities';

export class Locality {
    constructor(){

    }
    
    async all() {
        let sql = "select * from localities";
        let localities = await db.select(table, sql);
        return localities;
    }

    async find(id) {
        let sql = "select * from localities where id = " + id;

        let result = await db.get(sql);

        return result
    }

    async create(localities){
        let res = await helper.insertMany('localities', localities);
    }

    async count(){
        let sql = "select count(*) as quantidade from localities";

        let result = await db.get(sql);

        return result.quantidade;
    }
}