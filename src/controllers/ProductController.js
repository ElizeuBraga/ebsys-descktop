import {Product} from '../models/Product';

export class ProductController{
    constructor(){

    }

    index(){
        let product = new Product();
        let products = product.all();
        return products
    }

    async showByLocality(id){
        let product = new Product();
        let product1 = await product.findByLocality(id);

        return product1;
    }

    update(){

    }

    async store(p){
        let product = new Product();
        let result = await product.create(p);

        return result
    }

    destroy(){

    }
}