import sqlite3 from 'sqlite3';
import psql from 'postgres';

var sql = psql({
    host     : 'localhost',
    user     : 'postgres',
    password : 'postgres',
    database : 'ebsys'
});

export default {
    data(){
        return{
            localProducts:[]
        }
    },

    created(){
        // console.log(this.products)
        //$2a$10$YsoadGu/kTz9nHSqHINHAukOVgYT.ViRvKxc90SgPqffl1kWcIAve
        // $2y$10$Sb52MpW2MnpAQreuDbuHk.IZozue2BME74sGp7Xq9E5mBtS/4LvY2
    },

    computed:{
        location(){
          return window.location.pathname == '/'
        }
      },

     methods: {
       async dropTableProducts(){
            await sql`DROP TABLE IF EXISTS system.products`;

            await sql`CREATE TABLE IF NOT EXISTS system.products(
                id integer,
                name varchar,
                price float
            )`;
        },

        createTables(){
            var db = new sqlite3.Database('file.db');
            db.run("DROP TABLE IF EXISTS sections");
            db.run("CREATE TABLE IF NOT EXISTS sections (id,name)");
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

         async insertProduct(data) {
            await this.dropTableProducts()
            await sql`
            insert into system.products ${
              sql(data,'id','name', 'price')
            }
          `
        },

        async selectProducts(){
            const products = await sql`select * from system.products`.stream(row =>{
                this.localProducts.push(row)
            });
        }
    },

}