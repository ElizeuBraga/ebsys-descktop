import {Product} from '../models/Product';

export class ProductController{
    constructor(){

    }

    index(){
        let product = new Product();
        let products = product.all();
        return products
    }

    show(id){
        let product = new Product();
        let product1 = product.find(id);

        return product1;
    }

    update(){

    }

    store(){

    }

    destroy(){

    }
}