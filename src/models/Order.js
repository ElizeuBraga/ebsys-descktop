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

    async create(cart, payments, change, customer = false, ) {
        console.log(customer)
        let cashierOpened = await cashier.getOpened();

        db.execute('BEGIN;');
        let order = [
            {
                cashier_id: cashierOpened.id,
                customer_id: (customer) ? customer.id : customer.id,
                order_types_id: (customer) ? 1 : 2
            }
        ]

        let result = await db.insert(table, order);
    
        if(result){
            let items = []
            let order_id = result;
            for (const iterator of cart) {
                const todo = await fetch(iterator);
                items.push(
                    {
                        quantity: iterator.qtd,
                        product_id: iterator.id,
                        price: iterator.price,
                        order_id: order_id
                    }
                )
            }
            result = db.insert('items', items);

            if(result){
                let paymentsArray = []
                let paymentFormats = await payment.all();
                let total = 0;
                for (const pF of paymentFormats) {
                    for (const iterator of payments) {
                        const todo = await fetch(iterator);
                        if(iterator.payment_id == pF.id){
                            total += parseFloat(iterator.price) 
                        }    
                    }
                    paymentsArray.push(
                        {
                            payment_id: pF.id,
                            price: (pF.id == 1) ? total - change : total,
                            order_id: order_id
                        }
                    )
                    total = 0
                }

                result = await db.insert('payments_orders', paymentsArray);
                if(result){
                    db.execute('COMMIT;');
                    return;
                }
            }
        }
        db.execute('ROLLBACK;');
    }

    find(id) {

    }

    destroy(id){
        
    }
}