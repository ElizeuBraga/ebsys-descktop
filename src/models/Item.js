import {Order} from '../models/Order'
import { DB } from './DB'
const table = "items"
const db = new DB();
export class Item {
    constructor() {

    }

    async all() {

    }

    async create(items) {
        let response = await db.insert(table, items);
        return response;
    }

    find(id) {

    }
}