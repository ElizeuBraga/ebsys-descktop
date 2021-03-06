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

    async tratePayment(payments, change = 0, order_id = false){
        let paymentsArray = []
        let paymentFormats = await this.all();
        let total = 0;
        for (const pF of paymentFormats) {
            for (const iterator of payments) {
                const todo = await fetch(iterator);
                if(iterator.payment_id == pF.id){
                    total += parseFloat(iterator.price) 
                }    
            }

            if(total > 0){
                paymentsArray.push(
                    {
                        payment_id: pF.id,
                        price: (pF.id == 1) ? total - change : total,
                        order_id: order_id
                    }
                )
            }
            total = 0
        }

        return paymentsArray;
    }

    async create(payments){
        let response = await db.insert(table, payments);
        return response;
    }
}