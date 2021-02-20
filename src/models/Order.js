import { DB } from "./DB";
import { Helper } from "./Helper";
import { Cashier } from "./Cashier";
import { Payment } from "./Payment";
const helper = new Helper();
const cashier = new Cashier();
const payment = new Payment();
const db = new DB();
const table = 'orders';
export class Order {
    constructor() {

    }

    async all() {

    }

    async create(orders) {
        let response = await db.insert(table, orders);
        return response;
    }

    find(id) {

    }

    destroy(id){
        
    }
}