import {Helper} from './Helper'
import axios from 'axios';
import { decodeBase64 } from 'bcryptjs';
import Vue from 'vue';
import { DB } from './DB';
const util    = require('util');
const helper = new Helper();
const db = new DB();
// db.all = util.promisify(db.all);

let vue = new Vue();

export class Ws {
    constructor() {
        this.serverTables = [
            'users'
            ,'products', 'localities',
        ]
        this.localTables = [
            'cashiers'
            , 'customers', 'orders', 'items'
        ]
    }

    async loadAll(){
        for (let t of this.serverTables) {
            const todo = await fetch(t);
            await this.downloadDataFromServer(t)
            vue.$root.$emit("actualized_table", true);
        }

        for (let t of this.localTables) {
            const todo = await fetch(t);
            await this.uplodDataFromServer(t)
        }
    }

    async uplodDataFromServer(table){
        let lastId = await db.getLastId(table);
        await axios.get(table + '/getLastId/').then(async (response)=>{
            // console.log(response.data)
        })
    }

    async getDataFrom(table){
        let data = []
        await axios.get(table + '/get/').then(async (response)=>{
            data = response.data
        })

        return data
    }

    async downloadDataFromServer(table){
        await axios.get(table + '/getLastId/').then(async (response)=>{
            let lastIdLocal = await db.getLastId(table);
            if(parseInt(response.data[0].lastId) > lastIdLocal){
                let dataFromServer = await this.getDataFrom(table)
                db.insert(table, dataFromServer)                
            }
        })
    }
}
