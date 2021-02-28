import { DB } from "./DB";
import { Helper } from "./Helper";

const db = new DB();
const table = "adresses";
export class Address{
    async all(){
        let sql = 'select * from sections order by id';
        let result = db.all(sql);

        return result
    }

    async create(adresses){
        let response = await db.insert(table, adresses)
        return response;
    }

    async update(adresses){
        let response = await db.update(table, adresses)
        return response;
    }
}
