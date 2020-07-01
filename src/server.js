import sqlite3 from "sqlite3";
const db = new sqlite3.Database("/home/basis/Downloads/app-descktop/src/database/database.db");
require("http").createServer(async (req, res) => {
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

    }

    else {
        res.end("Not Found")
    }
}).listen(9000)