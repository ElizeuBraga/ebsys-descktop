import psql from 'postgres';
import axios from 'axios';
var sql = psql({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
});

export default {
    data() {
        return {
            host: 'http://127.0.0.1:8000/api/',
        }
    },

    created() {
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        axios.defaults.headers.common["Access-Control-Allow-Headers"] =
            "Content-Type";
        axios.defaults.headers.common["Authorization"] =
            "Bearer j2MFvmcsZ5RQY6Wn33q5VdRcafIm8lb2iko8zEeVvkyBNwl67gSdpjI31F9f";
        // console.log(this.products)
        //$2a$10$YsoadGu/kTz9nHSqHINHAukOVgYT.ViRvKxc90SgPqffl1kWcIAve
        // $2y$10$Sb52MpW2MnpAQreuDbuHk.IZozue2BME74sGp7Xq9E5mBtS/4LvY2
    },

    computed: {
        location() {
            return window.location.pathname == '/'
        }
    },

    methods: {
        async manageProducts(data){
            console.log(data)
            await sql`DROP TABLE IF EXISTS snackbar.products`;
            await sql`CREATE TABLE IF NOT EXISTS snackbar.products(id integer, name varchar, price float, status char, auxQtd char, auxObs char)`;
            if (data.length > 0) {
                await sql`insert into snackbar.products ${sql(data, 'id', 'name', 'price', 'status', 'auxQtd', 'auxObs')}`

                return data.length;
            }

            return data.length;
        },

        async manageOptions(data){
            await sql`DROP TABLE IF EXISTS snackbar.options`;
            await sql`CREATE TABLE IF NOT EXISTS snackbar.options(id integer, name varchar, status char)`;
            if (data.length > 0) {
                await sql`insert into snackbar.options ${sql(data, 'id', 'name', 'status')}`

                return data.length;
            }

            return data.length;
        },

        async selectProducts() {
            let products = await sql`select * from snackbar.products`;

            return products;
        },

        async selectOptions() {
            let options = await sql`select * from snackbar.options`;

            return options;
        },
    },

}