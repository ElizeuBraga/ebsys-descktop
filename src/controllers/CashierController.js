import {Cashier} from '../models/Cashier';
export class CashierController{
    constructor(){

    }

    async index(){
        await new Cashier().find();
    }

    show(id){
        
    }

    update(){

    }

    async store(){
        let item = new Cashier();
        item.create();
    }

    destroy(){

    }
}