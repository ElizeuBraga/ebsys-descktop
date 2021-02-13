import {DB} from './DB';

const db = new DB();
const table = 'payments';
export class Payment{
    constructor(){

    }


    async get(id){
        let sql = `SELECT name FROM ${table} WHERE id = ${id}`
        let payment = await db.select(sql);
        return payment[0].name;
    }

    async all(){
        let sql = `SELECT * from ${table}`;
        let payments = await db.select(sql);
        return payments;
    }

    create(payments, order_id){
        return;
    }
}