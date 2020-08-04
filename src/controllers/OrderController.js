import {Order} from '../models/Order';

export class OrderController{
    constructor(){

    }

    index(){
        
    }

    show(id){
        
    }

    update(){

    }

    async store(o, i, p){
        let order = new Order();
        let order_id = await order.create(o, i, p);
    }

    destroy(){

    }
}