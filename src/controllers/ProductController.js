import {Product} from '../models/Product';
import axios from "axios";
import { Helper } from '../models/Helper';
const helper = new Helper();
const product = new Product();
export class ProductController{
    constructor(){

    }

    async index(){
        let product = new Product();
        let products = await product.all();
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