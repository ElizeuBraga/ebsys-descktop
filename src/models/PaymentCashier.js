import {DB} from './DB';

const db = new DB();
const table = 'payments_cashiers';
export class PaymentCashier{
    constructor(){

    }

    async create(payments){
        let response = await db.insert(table, payments)
        return response;
    }
}