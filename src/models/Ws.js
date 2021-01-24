import {Helper} from './Helper'
import axios from 'axios';
import Vue from 'vue';
import { DB } from './DB';
const util    = require('util');
const helper = new Helper();
const db = new DB();
// db.all = util.promisify(db.all);

let vue = new Vue();

axios.defaults.baseURL = 'http://192.168.1.87:8080/ebsys/public_html/api/'
        // axios.defaults.baseURL = 'https://api-api-api-api.herokuapp.com/api/'
        // axios.defaults.headers.common["Host"] = "http://localhost:8000/api/";
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        axios.defaults.headers.common["Access-Control-Allow-Headers"] =
            "Content-Type";
        axios.defaults.headers.common["Authorization"] =
            "Bearer j2MFvmcsZ5RQY6Wn33q5VdRcafIm8lb2iko8zEeVvkyBNwl67gSdpjI31F9f";

export class Ws {
    constructor() {
        this.serverTables = [
            'users', 'sections','products', 'localities',
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
                axios.post(table + '/updatedToFalse/')            
            }
        })
    }
}
