import { Helper } from "./Helper";
import { DB } from "./DB";
const helper = new Helper();
const db = new DB();
const table = 'profiles';

export class Profile {
    constructor(){

    }

    create(profiles){
        let response = db.insert(table, profiles);
        return response;
    }
}