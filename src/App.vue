<template>
  <div>
    <b-card no-body class="h-100">
    
      <b-tabs v-model="tabIndex" card>
      <!--
        *
        *
        * Tab countertop
      -->
        <b-tab title="Balcão" :title-link-class="linkClass(0)">
        <b-row>
          <b-row class="w-50 p-3 mh-100">
            <b-col cols="10">
              <b-form-input v-model="search" list="producs" id="input-product"></b-form-input>
              <datalist id="producs">
                <option v-for="p in products" :value="p.name">{{ parseFloat(p.price).toFixed(2).replace('.', ',') }}</option>
              </datalist>
            </b-col>
            <b-col cols="2">
              <b-form-input type="number" min="1" value="1" id="input-qtd"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="w-50 p-3">
            <b-col>
              <table class="table  table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Produto</th>
                    <th class="text-center" scope="col">Valor</th>
                    <th class="text-center" scope="col">Quantidade</th>
                    <th class="text-center" scope="col">Valor parcial</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i, index) in cart" :key="index">
                    <th scope="row">{{i.id}}</th>
                    <td>{{i.name}}</td>
                    <td class="text-center">{{parseFloat(i.price).toFixed(2).replace('.', ',')}}</td>
                    <td class="text-center">{{i.qtd}}</td>
                    <td class="text-center">{{parseFloat(i.qtd * i.price).toFixed(2).replace('.', ',')}}</td>
                  </tr>
                </tbody>
              </table>

            </b-col>
          </b-row>
        </b-row>
        </b-tab>

        <!--
        *
        *
        * Tab deliveries
        -->
        <b-tab title="Entregas" :title-link-class="linkClass(1)">
          <b-row>
          <b-row class="w-50 p-3 mh-100">
            <b-col cols="10">
              <b-form-input v-model="search" list="producs" id="input-product"></b-form-input>
              <datalist id="producs">
                <option v-for="p in products" :value="p.name">{{ parseFloat(p.price).toFixed(2).replace('.', ',') }}</option>
              </datalist>
            </b-col>
            <b-col cols="2">
              <b-form-input type="number" min="1" value="1" id="input-qtd"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="w-50 p-3">
            <b-col>
              <table class="table  table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Produto</th>
                    <th class="text-center" scope="col">Valor</th>
                    <th class="text-center" scope="col">Quantidade</th>
                    <th class="text-center" scope="col">Valor parcial</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i, index) in cart" :key="index">
                    <th scope="row">{{i.id}}</th>
                    <td>{{i.name}}</td>
                    <td class="text-center">{{parseFloat(i.price).toFixed(2).replace('.', ',')}}</td>
                    <td class="text-center">{{i.qtd}}</td>
                    <td class="text-center">{{parseFloat(i.qtd * i.price).toFixed(2).replace('.', ',')}}</td>
                  </tr>
                </tbody>
              </table>
            </b-col>
          </b-row>
        </b-row>
        </b-tab>

        <!--
        *
        *
        * Tab cashiers
        -->
        <b-tab title="Meus caixas" :title-link-class="linkClass(2)">
          <b-row v-if = "cashier.closed">
            <b-col cols="8" class="text-danger">
              Caixa fechado
            </b-col>
            <b-col cols="4" class="text-right">
              <button class="btn btn-primary" @click="openCloseCashier">Abrir caixa</button>
            </b-col>
          </b-row>

          <table class="table  table-striped">
                <thead>
                  <tr>
                    <th scope="col">Data</th>
                    <th class="text-center" scope="col">Valor</th>
                    <th class="text-center" scope="col">Fechado por</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i, index) in cart" :key="index">
                    <th scope="row">{{i.id}}</th>
                    <td>{{i.name}}</td>
                    <td class="text-center">{{parseFloat(i.price).toFixed(2).replace('.', ',')}}</td>
                    <td class="text-center">{{i.qtd}}</td>
                    <td class="text-center">{{parseFloat(i.qtd * i.price).toFixed(2).replace('.', ',')}}</td>
                  </tr>
                </tbody>
              </table>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {Product} from './models/Product'
import { DB } from "./models/DB";
import { Ws } from "./models/Ws";
import { User } from "./models/User";
import { Cashier } from "./models/Cashier";
import { Helper } from "./models/Helper";
import {mixins} from './mixins/mixins';
import Swal from 'sweetalert2';
Vue.use(BootstrapVue)

// const db = new DB().createDatabase();
const product = new Product();
const helper = new Helper();
const ws = new Ws();
const db = new DB();
const user = new User();
const cashier = new Cashier();
 export default {
    // mixins:[mixins],
    data() {
      return {
        tabIndex: 0,
        products:[],
        cart:[],
        search:"",
        cashier:{
          closed:true
        }
      }
    },
    async mounted() {
      this.initLoginProccess();
      await ws.loadAll();
      document.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
          var inputProduct = document.getElementById("input-product");
          var inputQtd = document.getElementById("input-qtd");
          if(inputProduct === document.activeElement){
            if(inputProduct.value == ''){
              return
            }
            inputQtd.focus();
            return
          }
          if(inputQtd === document.activeElement){
            if(inputQtd.value == ''){
              return
            }
            let prod = await product.selectProdutcToCart(inputProduct.value);
            prod[0].qtd = inputQtd.value
            this.cart.push(JSON.parse(JSON.stringify(prod[0])))
            inputProduct.focus();
            inputProduct.value = ""
            inputQtd.value = "1"
            this.search = ""
          }
        }
      });
    },
    methods: {
      async initLoginProccess(){
        let html = '<input id="swal-input1" placeholder="Email/Telefone" class="swal2-input">';
            html += '<input id="swal-input2" type="password" placeholder="Senha" class="swal2-input">';
        Swal.fire({
          title:"Login",
          html:html,
          allowOutsideClick:false,
          confirmButtonText: "Entrar",
          didOpen: () => {
            document.getElementById('swal-input1').value = localStorage.getItem('email_phone')
          },
          preConfirm: () => {
            let value1 = document.getElementById('swal-input1').value
            localStorage.setItem('email_phone', value1)
            let value2 = document.getElementById('swal-input2').value 
            if(value1 == ''){
               Swal.showValidationMessage('Digite seu email/telefone')
            }else if(value2 == ''){
              Swal.showValidationMessage('Digite sua senha')
            }
            return [value1,value2]
          }
        }).then(async (result)=>{
            let auth = await user.auth(result.value[0], result.value[1])
            if(!auth){
              Swal.showValidationMessage('Email e/ou senha estão incorretos!')
              this.initLoginProccess()
            }
        })
      },

      openCloseCashier(){
        cashier.create();
      },

      async login(){
        let auth = await user.auth()
        if(!auth){
          
        }
      },

      linkClass(idx) {
        if (this.tabIndex === idx) {
          return ['bg-primary', 'text-light']
        } else {
          return ['bg-light', 'text-info']
        }
      }
    },
    watch:{
      async search(e){
        let sql = "SELECT * from products where name like '%" + e + "%' OR price like '%"+ e +"%' limit 20";
        this.products = await db.select('products',sql);
      }
    }
  }
</script>
<style lang="scss">

</style>
