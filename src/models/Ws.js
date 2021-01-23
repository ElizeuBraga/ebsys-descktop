import {Helper} from './Helper'
import axios from 'axios';
import { decodeBase64 } from 'bcryptjs';
import Vue from 'vue';
const util    = require('util');
import sqlite3, { verbose } from "sqlite3";
const db = new sqlite3.Database(window.process.env.APP_DATABASE_URL);
const helper = new Helper();
db.all = util.promisify(db.all);

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
        await axios.get(table + '/getLastId/').then(async (response)=>{
            let sql = "select * from " + table + " where id > " + parseInt(response.data[0].lastId);
            await db.all(sql).then(async (rows)=>{
                if(rows.length > 0){
                    console.log(rows)
                    await axios.post(table + '/post/', rows).then((response)=>{
                        console.log(response.data)
                    })
                    console.log('Uploading data to ' + table)
                }else{
                    console.log('No data to upload in ' + table)
                }
            })
        })
    }

    async downloadDataFromServer(table){
        let success = false;
        await axios.get(table + '/getLastId/').then(async (response)=>{
            if(response.data){
                await axios.get(table + '/get/').then(async (response)=>{
                    let insert = await helper.insertMany(table, response.data);

                    if(insert){
                        await axios.post(table + '/updatedToFalse');
                    }
                })
            }else{
                console.log('data in ' + table + " are actualized")
            }
        }).then(()=>{
            success = true;
        }).catch(()=>{
            success = false
        })

        return success;
    }
}
