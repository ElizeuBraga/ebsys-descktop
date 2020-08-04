import {Payment} from '../models/Payment';
export class PaymentController{
    async store(payments, order_id){
        let payment = await new Payment();
        payment.create(payments, order_id);
    }

    calcPayment(toReceive, payment, payments, total){
        payment.price = toReceive
        // let calcResult = 0;
        // payments.forEach(e => {
        //    calcResult += e.price  
        // });

        // let result = total - calcResult;
        return payment;
    }
}