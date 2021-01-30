import { DB } from "./DB";
const db = new DB();
const table = 'customers';
export class Customer{

    async create(customer){
        let array = [
            {
                name: customer[0],
                phone: customer[1],
                address: customer[2],
                locality_id: customer[3],
            }
        ]

        let response = await db.insert(table, array)

        return response
    }

    async find(phone){
        let sql = ` select c.*, l.name as locality from customers c 
                    join localities l on l.id = c.locality_id
                    where phone = '${phone}'`;
        let response = await db.select(table, sql);

        return response;
    }

    async update(customer){
        let sql = ` UPDATE ${table} SET name = '${customer[0]}', phone = '${customer[1]}', 
                    address = '${customer[2]}', locality_id = ${customer[3]},
                    updated_at = now() WHERE phone = '${customer[1]}'`

        let response = await db.execute(sql)

        return response;
    }
}