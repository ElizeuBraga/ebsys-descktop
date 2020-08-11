import {Payment} from '../models/Payment';
export class PaymentController{
    async store(payments, order_id){
        let payment = await new Payment();
        payment.create(payments, order_id);
    }

    calcPayment(payments){
        let total = 0;
        payments.forEach(element => {
            total += parseFloat(element.totalForThispayment)
        });

        let result = payments[0].total - total
        console.log(result)
        return result;
    }
}