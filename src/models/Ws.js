import {Helper} from './Helper'
import axios from 'axios';
import { decodeBase64 } from 'bcryptjs';
import Vue from 'vue';
const util    = require('util');
import sqlite3 from "sqlite3";
const db = new sqlite3.Database(window.process.env.APP_DATABASE_URL);
const helper = new Helper();
db.all = util.promisify(db.all);

let vue = new Vue();

export class Ws {
    constructor() {
        this.serverTables = ['products', 'localities', 'users']
        this.localTables = ['cashiers', 'customers', 'orders', 'items']
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
        await axios.post('maxid', {table:table}).then(async (response)=>{
            let sql = "select * from " + table + " where id > " + response.data;
            await db.all(sql).then(async (rows)=>{
                if(rows.length > 0){
                    await axios.post(table, rows)
                    console.log('Uoloading data to ' + table)
                }else{
                    console.log('No data to upload in ' + table)
                }
            })
        })
    }

    async downloadDataFromServer(table){
        await axios.post('hasUpdated', {table:table}).then(async (response)=>{
            if(response.data){
                await axios.get(table).then(async (response)=>{
                    await helper.insertMany(table, response.data);
                    await axios.put('changeUpdated', {table: table});
                })
            }else{
                console.log('data in ' + table + " are actualized")
            }
        })
    }
}
