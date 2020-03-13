import sqlite3 from 'sqlite3';
// let db = new sqlite3.Database(':memory:');
var db = new sqlite3.Database('file.db');

export default {
    methods: {
        createTables(){
            db.run("DROP TABLE IF EXISTS products")
            db.run("DROP TABLE IF EXISTS counters")
            db.run("DROP TABLE IF EXISTS orders")
            db.run("DROP TABLE IF EXISTS users")
            db.run("CREATE TABLE IF NOT EXISTS products (id,name, price)");
            db.run("CREATE TABLE IF NOT EXISTS users (id,name, address)");
            db.run("CREATE TABLE IF NOT EXISTS counters (product_id, quantity, parcial_price, total_price)");
            db.run("CREATE TABLE IF NOT EXISTS orders (user_name, quantity)");
        },

        insertPedido(name, price) {
            db.serialize(function () {
                db.run("INSERT INTO products VALUES ('null', ?, ?)", [name, price]);
            });

            db.each("SELECT * FROM products", function (err, row) {
                console.log(row);
            });

            db.close();
        },

        insertUser(name, address, phone){
            db.serialize(function () {
                db.run("INSERT INTO users VALUES (?, ?, ?)", [name, address, phone]);
            });
        }
    },

}