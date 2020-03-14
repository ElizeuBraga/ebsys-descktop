import sqlite3 from 'sqlite3';

export default {
    data(){
        return{
            products:[]
        }
    },
    methods: {
        createTables(){
            var db = new sqlite3.Database('file.db');

            db.run("DROP TABLE IF EXISTS sections");
            db.run("DROP TABLE IF EXISTS products");
            db.run("CREATE TABLE IF NOT EXISTS sections (id,name)");
            db.run("CREATE TABLE IF NOT EXISTS products (id,name, section_id, price, FOREIGN KEY(section_id) REFERENCES sections(id))");

            db.close();
        },

        insertSection(id, name) {
            var db = new sqlite3.Database('file.db');

            var insert = db.serialize(function () {
                db.run("INSERT INTO sections VALUES (?, ?)", [id, name]);
            });

            db.close();

            return console.log(insert);
        },

        insertProduct(id, name, section_id, price) {
            var db = new sqlite3.Database('file.db');

            db.serialize(function () {
                db.run("INSERT INTO products VALUES (?, ?, ?, ?)", [id, name, section_id, price]);
            });

            db.close();
        },

        selectProducts(){
            var db = new sqlite3.Database('file.db');
            let vm = this
            db.all("SELECT * FROM Products", function (err, rows) {
                rows.forEach( row => vm.products.push(row));
            });

            db.close();
            
            return this.products;

        }
    },

}