import {Cashier} from '../models/Cashier';
export class CashierController{
    constructor(){

    }

    async index(){
        // let cashier = new Cashier();
        // let result = await cashier.find();
        // return result;
    }

    async show(id=null){
        let cashier = new Cashier();
        let result = await cashier.find();
        return result;
    }

    update(){
        let cashier = new Cashier();
        cashier.update();
    }

    async store(){
        let item = new Cashier();
        item.create();
    }

    destroy(){

    }
}