import axios from 'axios';
import { Helper } from "../models/Helper";
import {Payment} from '../models/Payment';
import EventBus from '../EventBus';
import Swal from "sweetalert2";

let helper = new Helper();
export default {
    data() {
        return {
            tabIndex:0,
            paymentsFormats: [],
            cashierIsOpen: false
        }
    },

    async created() {
        EventBus.$on("change-tab", (e) => {
            // this.reset();
            this.tabIndex = e;
            // if (e == 1) {
            //   this.initDeliveryOrder();
            // }
        });
        this.paymentsFormats = await new Payment().all();
        // if(localStorage.employees){
        //     this.employees = localStorage.employees
        // }

        // axios.defaults.baseURL = 'http://192.168.1.87:8080/ebsys/public_html/api/'
        // // axios.defaults.baseURL = 'https://api-api-api-api.herokuapp.com/api/'
        // // axios.defaults.headers.common["Host"] = "http://localhost:8000/api/";
        // axios.defaults.headers.common["Content-Type"] = "application/json";
        // axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        // axios.defaults.headers.common["Access-Control-Allow-Headers"] =
        //     "Content-Type";
        // axios.defaults.headers.common["Authorization"] =
        //     "Bearer j2MFvmcsZ5RQY6Wn33q5VdRcafIm8lb2iko8zEeVvkyBNwl67gSdpjI31F9f";
        // // console.log(this.products)
        // //$2a$10$YsoadGu/kTz9nHSqHINHAukOVgYT.ViRvKxc90SgPqffl1kWcIAve
        // // $2y$10$Sb52MpW2MnpAQreuDbuHk.IZozue2BME74sGp7Xq9E5mBtS/4LvY2
    },

    computed: {
        
    },

    methods: {
        formatMoney(value){
            return parseFloat(value).toFixed(2).replace('.', ',')
        }
    },
}