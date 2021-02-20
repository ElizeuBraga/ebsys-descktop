import { Helper } from "./Helper";
import { DB } from "./DB";
const helper = new Helper();
const db = new DB();
const table = 'cities';

export class City {
    constructor(){

    }
    
    async all() {
        let sql = `select * from ${table}`;
        let cities = await db.selectMany(sql);
        return cities;
    }

    async find(id) {
        let sql = "select * from localities where id = " + id;

        let result = await db.get(sql);

        return result
    }

    async create(cities){
        let response = await db.insert(table, cities);
        return response;
    }

    async count(){
        let sql = "select count(*) as quantidade from localities";

        let result = await db.get(sql);

        return result.quantidade;
    }
}