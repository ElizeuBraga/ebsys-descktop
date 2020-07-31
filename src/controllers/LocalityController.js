import {Locality} from '../models/Locality';

export class LocalityController{
    constructor(){

    }

    async index(){
        let locality = new Locality();
        let localities = await locality.all();

        return localities;
    }

    show(id){
        // let product = new Product();
        // let product1 = product.find(id);

        // return product1;
    }

    update(){

    }

    store(){

    }

    destroy(){

    }
}