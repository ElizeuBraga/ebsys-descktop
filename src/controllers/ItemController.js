import {Item} from '../models/Item';

export class ItemController{
    constructor(){

    }

    index(){
        
    }

    show(id){
        
    }

    update(){

    }

    async store(items, order_id){
        let item = new Item();
        item.create(items, order_id);
    }

    destroy(){

    }
}