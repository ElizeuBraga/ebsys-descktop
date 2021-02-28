import { DB } from "./DB";
const db = new DB();
const table = 'customers';
export class Customer{

    async create(customers){
        let response = await db.insert(table, customers)
        return response
    }

    async find(phone){
        let sql = `select 
                        c.id, c.name, c.phone, a.id as address_id, a.address, a.complement, a.city_id, c2.name as city_name 
                    from ${table} c
                    left join adresses a on a.customer_id = c.id
                    left join cities c2 on c2.id = a.city_id WHERE c.phone = '${phone}';`;
        let response = await db.selectOne(sql);

        return response;
    }

    async getRate(phone){
        let sql = `select 
                    p.* 
                from products p
                join cities c on c.product_id = p.id
                join adresses a on a.city_id = c.id
                join customers c2 on c2.id = a.customer_id
                where c2.phone = '${phone}';`;

        return db.selectOne(sql);
    }

    async update(customers){
        let response = await db.update(table, customers);

        return response;
    }
}