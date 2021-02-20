import { Helper } from "./Helper";
import { DB } from "./DB";
const helper = new Helper();
const db = new DB();
const table = 'order_types';

export class OrderType{
    constructor(){

    }

    create(orderTypes){
        let response = db.insert(table, orderTypes);
        return response;
    }
}