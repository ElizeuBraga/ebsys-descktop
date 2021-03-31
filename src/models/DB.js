import mysql from 'mysql';
var nodemailer = require("nodemailer");
import mysqldump from 'mysqldump';
const encrypt = require('node-file-encrypt');
'use strict';
require('dotenv/config');
const fs = require('fs');

var dbCredencials = {
   host : process.env.VUE_APP_DB_HOST,
   user : process.env.VUE_APP_DB_USERNAME,
   password : process.env.VUE_APP_DB_PASSWORD,
   database : process.env.VUE_APP_DB_NAME
}
var con = mysql.createConnection(dbCredencials);
export class DB {
    teste(){
        console.log(process.env)
    }

    async backupData() {
        // dump the result straight to a file
        let filePath = './src/database/backups/ebsys_descktop_backup.sql'
        let encryptPath = '';

        console.log('Backup iniciado')
        mysqldump({
            connection: dbCredencials,
            dumpToFile: filePath,
        }).then(() => {
            let f = new encrypt.FileEncrypt(filePath);
            f.openSourceFile();
            f.encrypt('@Ae12345678');
            encryptPath = f.encryptFilePath;

            fs.unlink(filePath, function (err) {
                if (err) throw err;
                console.log('File deleted!');
            });

            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.VUE_APP_EMAIL_USER,
                    pass: process.env.VUE_APP_EMAIL_PASSWORD,
                },
            });

            var mailOptions = {
                from: process.env.VUE_APP_EMAIL_USER,
                to: "elizeubragasantos@gmail.com",
                subject: "Backup do dia {data}",
                text: 'Backup diário',
                attachments: [
                    {
                        filename: encryptPath,
                        path: encryptPath
                    }
                ]
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent");
                }
            });
            // decript data
            // let f2 = new encrypt.FileEncrypt(encryptPath);
            // f2.openSourceFile();
            // f2.decrypt('111111');
            // console.log("decrypt sync done");

            let oldEncryptedFile = localStorage.getItem('oldEncryptedFile')

            if (oldEncryptedFile) {
                fs.unlink(oldEncryptedFile, function (err) {
                    if (err) throw err;
                    console.log('File deleted!');
                });
            }
            localStorage.setItem('oldEncryptedFile', encryptPath)

            console.log('Backup')
        });

    }

    async update(table, array) {
        this.execute('BEGIN;');
        for await (const [i, a] of array.entries()) {
            let keys = Object.keys(a);
            let values = Object.values(a);
            let sql = "UPDATE " + table + " SET ";
            let map = ""

            let count = 1;
            for await (const [j, k] of keys.entries()) {
                if (keys[j] != 'id' && values[j] != null) {
                    let final = ((keys[j] == 'updated_at') ? "" : ", ");
                    map += keys[j] + " = '" + values[j] + "'" + final
                }
            }

            let updated_at = "";
            if (!keys.includes('updated_at')) {
                updated_at = " updated_at = NOW()"
            }
            sql += map + updated_at + " WHERE id = " + a.id

            await this.execute(sql);
        }

        this.execute('COMMIT;');

        return true;
    }

    async insert(table, items) {
        let values = "";
        for await (let [i, a] of items.entries()) {
            // const todo = await fetch(a);
            let keys = JSON.stringify(Object.values(a)).replace('[', '(');
            keys = keys.replace(/"/gi, "'");
            values += keys.replace(']', ')') + ((i == items.length - 1) ? "" : ",")
        }

        let sql = "INSERT INTO " + table + "(" + Object.keys(items[0]) + ") values " + values;

        return new Promise(function (resolve, reject) {
            con.query(sql, (err, result) => {
                if (err) {
                    console.log(err)
                    resolve(false)
                } else {
                    // let sql = `INSERT INTO updateds(table_name, made_in)VALUES(${table}, 'local')`;
                    // this.execute(sql);
                    // console.log('Insert successfull')
                    resolve(result.insertId)
                    // resolve(true)
                }
            });
        });
    }

    async getLastId(table) {
        let sql = "SELECT CASE WHEN MAX(id) IS NULL THEN 0 ELSE MAX(id) END AS lastId FROM " + table
        return new Promise(function (resolve, reject) {
            con.query(sql, async (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    resolve(result[0].lastId);
                }
            })
        });
    }

    async getLastDate(table) {
        let sql = "SELECT CASE WHEN MAX(updated_at) IS NULL THEN false ELSE MAX(updated_at) END AS lastDate FROM " + table

        return await this.selectOne(sql);
    }

    async select(sql) {
        return new Promise(function (resolve, reject) {
            con.query(sql, async (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    if (result.length > 0) {
                        resolve(result);
                    }

                    resolve(false);
                }
            })
        });
    }

    async selectOne(sql) {
        return new Promise(function (resolve, reject) {
            con.query(sql, async (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    if (result.length > 0) {
                        if (result.length == 1) {
                            resolve(result[0])
                        }
                        resolve(result);
                    }

                    resolve(false);
                }
            })
        });
    }

    async selectMany(sql) {
        return new Promise(function (resolve, reject) {
            con.query(sql, async (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    if (result.length > 0) {
                        resolve(result);
                    }

                    resolve(false);
                }
            })
        });
    }

    async execute(sql) {
        return new Promise(function (resolve, reject) {
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    resolve(false)
                }
                resolve(true)
            });
        })
    }

    async createDatabaseAndTables(){
        Swal.fire({
            title:"Aguarde",
            text:"Configurando banco de dados",
            timer:5000,
            // timerProgressBar:true,
            didOpen:()=>{
                Swal.showLoading();
            }
        })

        // return;
        // let sqlCreateDataBase = "CREATE DATABASE IF NOT EXISTS ebsys_descktop";
        // await this.execute(sqlCreateDataBase);

        let sqlCreateTableSections = `
            CREATE TABLE IF NOT EXISTS sections(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) not null,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL
            );
        `;
        
        await this.execute(sqlCreateTableSections);

        let sqlCreateTableProducts = `
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                price REAL NOT NULL,
                section_id INTEGER NOT NULL,
                ask_obs BOOLEAN NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL,
                FOREIGN KEY (section_id) REFERENCES sections(id)
            );
        `;

        await this.execute(sqlCreateTableProducts);

        let sqlCreateTableProfiles = `
            CREATE TABLE IF NOT EXISTS profiles(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(15),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL
            );
        `;

        await this.execute(sqlCreateTableProfiles);

        let sqlCreateTableUsers = `
            CREATE TABLE IF NOT EXISTS users(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(20) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                phone VARCHAR(11) UNIQUE NOT NULL,
                password VARCHAR(60) NOT NULL,
                token VARCHAR(60),
                change_password BOOLEAN NOT NULL DEFAULT 1,
                profile_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL,
                FOREIGN KEY (profile_id) REFERENCES profiles(id)
            );
        `;

        await this.execute(sqlCreateTableUsers);

        let sqlCreateTableCities = `
            CREATE TABLE IF NOT EXISTS cities(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(20) NOT NULL,
                product_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL,
                FOREIGN KEY (product_id) REFERENCES products (id)
            );
        `;

        await this.execute(sqlCreateTableCities);

        let sqlCreateTableCustomers = `
            CREATE TABLE IF NOT EXISTS customers(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                phone VARCHAR(11) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL
            );
        `;

        await this.execute(sqlCreateTableCustomers);

        let sqlCreateTableAdresses = `
            CREATE TABLE IF NOT EXISTS adresses(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                address VARCHAR(30) NOT NULL,
                complement VARCHAR(30),
                city_id INTEGER NOT NULL,
                customer_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL,
                FOREIGN KEY (customer_id) REFERENCES customers (id),
                FOREIGN KEY (city_id) REFERENCES cities (id)
                
            );
        `;

        await this.execute(sqlCreateTableAdresses);

        let sqlCreateTableCashiers = `
            CREATE TABLE IF NOT EXISTS cashiers(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            );
        `;

        await this.execute(sqlCreateTableCashiers);

        let sqlCreateTablePayments = `
            CREATE TABLE IF NOT EXISTS payments(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(8),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL
            );
        `;

        await this.execute(sqlCreateTablePayments);

        let sqlCreateTablePaymentsCashiers = `
            CREATE TABLE IF NOT EXISTS payments_cashiers(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                payment_id INTEGER NOT NULL,
                cashier_id INTEGER NOT NULL,
                price REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL,
                FOREIGN KEY (payment_id) REFERENCES payments (id),
                FOREIGN KEY (cashier_id) REFERENCES cashiers (id)
            );
        `;

        await this.execute(sqlCreateTablePaymentsCashiers);

        let sqlCreateTableOrderTypes = `
            CREATE TABLE IF NOT EXISTS order_types(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(10),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL
            );
        `;

        await this.execute(sqlCreateTableOrderTypes);

        let sqlCreateTableOrders = `
            CREATE TABLE IF NOT EXISTS orders(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                cashier_id INTEGER NOT NULL,
                customer_id INTEGER,
                order_types_id INTEGER NOT NULL,
                is_open bool DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL,
                FOREIGN KEY (cashier_id) REFERENCES cashiers (id),
                FOREIGN KEY (customer_id) REFERENCES customers (id),
                FOREIGN KEY (order_types_id) REFERENCES order_types (id)
            );
        `;

        await this.execute(sqlCreateTableOrders);

        let sqlCreateTableItems = `
            CREATE TABLE IF NOT EXISTS items(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                quantity INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                price REAL NOT NULL,
                order_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL,
                FOREIGN KEY (order_id) REFERENCES orders (id),
                FOREIGN KEY (product_id) REFERENCES products (id)
            );
        `;

        await this.execute(sqlCreateTableItems);

        let sqlCreateTablePaymentsOrders = `
            CREATE TABLE IF NOT EXISTS payments_orders(
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                order_id INTEGER NOT NULL,
                payment_id INTEGER NOT NULL,
                price REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL,
                FOREIGN KEY (payment_id) REFERENCES payments (id),
                FOREIGN KEY (order_id) REFERENCES orders (id)
            );
        `;

        await this.execute(sqlCreateTablePaymentsOrders);

        return false;
    }
}