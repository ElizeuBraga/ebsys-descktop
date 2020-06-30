import sqlite3 from "sqlite3";
const db = new sqlite3.Database("/home/basis/Downloads/app-descktop/src/database/database.db");
require("http").createServer(async (req, res) => {
    if (req.url == '/') {
        res.end("Raiz");
    }

    else if (req.url == '/orders') {
        let products = []
        let sql = "select * from orders";
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