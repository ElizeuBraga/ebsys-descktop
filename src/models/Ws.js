import {Helper} from './Helper'
import axios from 'axios';

const helper = new Helper();

export class Ws {
    constructor() {
        
    }

    async loadAll(){
        if(await this.checkIfHasUpdates()){
            let tables = [];
            tables.push(await this.loadProducs());
            tables.push(await this.loadLocalities());
            tables.push(await this.loadUsers());
            
            return this.changeUpdated(tables);
        }
    }

    async changeUpdated(tables){
        await axios.put("changeUpdated", tables).then(async (response)=>{
            console.log("Dados atualizados não retornarão mais do WS")
        })

        return true;
    }

    async loadProducs(){
        await axios.get("products").then(async (response)=>{
            await helper.insertMany('products', response.data);
        })

        return 'products';
    }

    async loadUsers(){
        await axios.get("users").then(async (response)=>{
            await helper.insertMany('users', response.data);
        })

        return 'users';
    }

    async loadLocalities(){
        await axios.get("localities").then(async (response)=>{
            await helper.insertMany('localities', response.data);
        })

        return 'localities';
    }

    async checkIfHasUpdates(){
        let hasUpdates = false;
        await axios.get("checkIfHasUpdates").then(async (response)=>{
            hasUpdates = response.data;
            console.log(hasUpdates)
        })

        if(!hasUpdates){
            console.log('O sistema está atualizado')
        }
        return hasUpdates;
    }
}
