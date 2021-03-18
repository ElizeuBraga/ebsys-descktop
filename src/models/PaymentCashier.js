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

    async paymentsForCashier(cashier_id, type){
        console.log(type)
        let and = '';
        if(type == 'B'){
            and = ' AND o.order_types_id = 1'
        }else if(type == 'D'){
            and = ' AND o.order_types_id = 2'
        }

        let sql = `
            select
                p.name, 
                sum(price) as total
            from payments_cashiers pc
            join payments p on p.id = pc.payment_id
            join cashiers c on c.id = pc.cashier_id
            join orders o on o.cashier_id = c.id
            join order_types ot on ot.id = o.order_types_id
            where pc.cashier_id = ${cashier_id} ${and}
            GROUP by pc.id
    `;

    sql = `
            select
            -- 	*
                p.name, 
                sum(price) as total
            from cashiers c
            join orders o on o.cashier_id = c.id
            join payments_orders po on po.order_id = o.id
            join payments p on p.id = po.payment_id
            where c.id = ${cashier_id} ${and}
            GROUP by p.id;
    `;

    let detailPayment = await db.select(sql)
    return (detailPayment) ? detailPayment : []
    }
}