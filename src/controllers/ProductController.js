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

    async loadProducsFromServer(){
        let productsNotInDB = []
        await axios.get("products/getUpdateds/getUpdateds/getUpdateds").then(async (response)=>{
            if(response.data.length == 0){
                console.log('Nada a atualizar')
                return
            }
            for (let p of response.data) {
                const todo = await fetch(p);
                // columns.push(c.name)
                // console.log(p.name)
                await product.find(p.id).then(async (p2)=>{
                    if(p2){
                        await product.update(p)
                        console.log('Atualizei')
                    }else{
                        productsNotInDB.push(p)
                    }
                });
            }
        }).finally(()=>{
            if(productsNotInDB.length > 0){
                console.log('Inseri ' + productsNotInDB.length)
                helper.insertMany('products', productsNotInDB);
            }
        });
    }
}