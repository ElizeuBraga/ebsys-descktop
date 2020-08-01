import sqlite3 from "sqlite3";
import {ProductController} from './controllers/ProductController';
import { UserController } from "./controllers/UserController";
const db = new sqlite3.Database("/home/basis/Downloads/app-descktop/src/database/database.db");
require("http").createServer(async (req, res) => {
    var response = ''

    if (req.url == '/') {
        res.end("Raiz");
    }

    else if (req.url == '/orders') {
        let sql = `
            select
                p.name,
                p.price,
                sum(quantity) as quantity,
                sum(p.price * i.quantity) as total
            from
                products p
            join itemsorders i on
                i.product_id = p.id
            join orders o on
                o.id = i.order_id
            GROUP by
                p.id;
        `;
        db.all(sql, (err, rows) => {
            if (err) {
                return console.log(err);
            }
            // rows.forEach(row => {
            //     products.push(row);
            // });
            res.end(JSON.stringify(rows))
        });

    }
    else if (req.url == '/deliveries') {
        let sql = `
        select
            p.name,
            p.price,
            sum(quantity) as quantity,
            sum(p.price * i.quantity) as total
        from
            products p
        join itemsdeliveries i on
            i.product_id = p.id
        join deliveries d on
            d.id = i.delivery_id
        GROUP by
            p.id;
        `;
        db.all(sql, (err, rows) => {
            if (err) {
                return console.log(err);
            }
            // rows.forEach(row => {
            //     products.push(row);
            // });
            res.end(JSON.stringify(rows))
        });

    }else if(req.url == '/products'){
        if (req.method == 'POST') {
            req.on('data', (chunk) =>{
                let data = JSON.parse(chunk)
                let product = new ProductController();
                let resp = product.store(data);
                
                response = resp
            })

            res.end(response)
        }else if (req.method == 'GET') {
            res.end("GET")                
        }else{
            res.end("Method not allowed (suport GET or POST)")                
        }
    }else if(req.url == '/users'){
        if (req.method == 'POST') {
            req.on('data', (chunk) =>{
                let data = JSON.parse(chunk)
                let user = new UserController();
                let resp = user.store(data);
                
                response = resp
            })

            res.end(response)
        }else if (req.method == 'GET') {
            res.end("GET")                
        }else{
            res.end("Method not allowed (suport GET or POST)")                
        }
    }
    else {
        res.end("Not Found")
    }
}).listen(9000)