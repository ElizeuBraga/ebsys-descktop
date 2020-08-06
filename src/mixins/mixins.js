import axios from 'axios';
// import sqlite3  from 'sqlite3';
// let db =  new sqlite3.Database('/home/basis/Downloads/app-descktop/src/database/database.db')

export default {
    data() {
        return {
            //colors
            backgroundColor:"f5f5f5",
            mainColor: "orange",


            loggedUser:{},
            colorPrimary:'#f5d019',
            colorSecondary:'#dd3130',
            orderColor:"#dd3130",
            alertBd:false,
            color:"#f5624c",
            textColor: "white",
            familyOrange:['green', 'yellow', 'blue'],
            myColor: "blue",
            logged: false,
            employees: [],
            user: (localStorage.user)?JSON.parse(localStorage.user):{my_color:'orange'},
            host: 'http://192.168.15.7:8000/api/',
            // host: 'http://localhost:8000/api/',
        }
    },

    created() {
        if(localStorage.employees){
            this.employees = localStorage.employees
        }
        // axios.defaults.headers.common["Host"] = "http://192.168.15.7:8000/api/";
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
        showMessageError(msg){
            this.error = true
            this.msg = msg
            setTimeout(()=>{
              this.error = false
            }, 3000)
          },

          showMessageErrorLogin(msg){
            this.msgLogin = true
            this.msgloginerror = msg
            setTimeout(()=>{
                this.msgLogin = false
            }, 3000)
          },
      
          showMessageSucess(msg){
            this.success = true
            this.msg = msg
            setTimeout(()=>{
              this.success = false
            }, 3000)
          },

          showMessageSuccessLogin(msg){
            this.msgLogin = true
            this.msgloginerror = msg
            setTimeout(()=>{
                this.msgLogin = true
            }, 3000)
          },
    },

}