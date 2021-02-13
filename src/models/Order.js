import { Helper } from "./Helper";
const helper = new Helper();
const table = 'orders';
export class Order {
    constructor() {

    }

    async all() {

    }

    async create(cart, payments) {
        console.log([cart, payments])
    }

    find(id) {

    }

    destroy(id){
        
    }
}