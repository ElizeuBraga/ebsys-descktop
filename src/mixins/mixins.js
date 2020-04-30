import axios from 'axios';
import sqlite3  from 'sqlite3';

export default {
    data() {
        return {
            db: new sqlite3.Database('/home/basis/Downloads/app-descktop/src/database/database.db'),
            alertBd:false,
            myColor: "blue",
            logged: false,
            employees: [],
            user: (localStorage.user)?JSON.parse(localStorage.user):{my_color:'orange'},
            host: 'http://192.168.43.209:8000/api/',
        }
    },

    created() {
        if(localStorage.employees){
            this.employees = localStorage.employees
        }
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
        createDataBaseStructure(){
            this.db.serialize(()=>{
                // table users
                this.db.run("DROP TABLE IF EXISTS users");
                this.db.run("CREATE TABLE users(name, email UNIQUE, phone, password, profile)");
                
                //sections
                this.db.run("DROP TABLE IF EXISTS sections");
                this.db.run("CREATE TABLE sections(name)");
                
                //products table
                this.db.run("DROP TABLE IF EXISTS products");
                this.db.run("CREATE TABLE products(name, price REAL)");

                //system table
                this.db.run("DROP TABLE IF EXISTS system");
                this.db.run("CREATE TABLE system(status INTEGER)");

                this.db.run("INSERT INTO system VALUES (?)", (0));


                this.alertBd = true;
                this.database = false
                this.admin = true;
                this.title = 'Criar administrador do sistema'
            });
        },

        showAlert(type, msg, timer=2000){
            this.alert = true
            this.typeAlert = type
            this.message = msg

            setTimeout(()=>{
                this.alert = false
            }, timer);
        }
    },

}