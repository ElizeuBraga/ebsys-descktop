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
}