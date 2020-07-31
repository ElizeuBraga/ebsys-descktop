import {Customer} from '../models/Customer'
export class CustomerController{
    async store(c){
        let customer = new Customer();
        let response = await customer.create(c);

        return response;
    }
}