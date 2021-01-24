<template>
  <div>
    <b-card no-body class="h-100">
      <b-tabs v-model="tabIndex" card>
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
        <b-tab title="Entregas" :title-link-class="linkClass(1)">Tab contents 2</b-tab>
        <b-tab title="Meus caixas" :title-link-class="linkClass(2)">Tab contents 3</b-tab>
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
import {mixins} from './mixins/mixins';
Vue.use(BootstrapVue)

// const db = new DB().createDatabase();
const product = new Product();
const ws = new Ws();
const db = new DB();
 export default {
    // mixins:[mixins],
    data() {
      return {
        tabIndex: 0,
        products:[],
        cart:[],
        search:""
      }
    },
    async mounted() {
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
        event.preventDefault();
        this.products = await db.select('products',sql);
      }
    }
  }
</script>
<style lang="scss">

</style>
