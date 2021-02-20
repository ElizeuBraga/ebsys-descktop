import {DB} from './DB';

const db = new DB();
const table = 'payments_orders';
export class PaymentOrder{
    constructor(){

    }

    async create(payments){
        let response = await db.insert(table, payments);
        return response;
    }
}