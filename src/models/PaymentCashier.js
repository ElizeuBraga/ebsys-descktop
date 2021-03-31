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
        let and = '';
        if(type == 'B'){
            and = ' AND o.order_types_id = 1'
        }else if(type == 'D'){
            and = ' AND o.order_types_id = 2'
        }

        let sql = `
                    select * from (
                        select
                            p.name, 
                            sum(price) as total
                        from cashiers c
                        join payments_cashiers pc on pc.cashier_id = c.id
                        join payments p on p.id = pc.payment_id
                        where c.id = ${cashier_id}
                        GROUP by p.id
                        
                        union all
                        
                        select name, 
                            0 as total
                        from payments p 
                        where id not in (
                                select
                                p.id
                            from cashiers c
                            join payments_cashiers pc on pc.cashier_id = c.id
                            join payments p on p.id = pc.payment_id
                            where c.id = ${cashier_id}
                            GROUP by p.id
                        )
                    ) as foo order by  name;
        `;

        let detailPayment = await db.selectMany(sql)
        return (detailPayment) ? detailPayment : []
    }
    
}