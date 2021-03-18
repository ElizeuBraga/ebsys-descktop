<template>
  <div>
    <!-- <b-row> -->
    <b-row style="min-width: 50%">
          <b-col cols="6">
          <!-- <b-row style="background-color:red; height:90%"> -->
          <div class="text-center">Meus caixas</div>
          <div style="overflow-y: scroll; max-height: 87vh">
            <table class="table table-striped" style="background-color: white">
              <thead>
                <tr>
                  <th class="text-center" scope="col">Valor</th>
                  <th class="text-center" scope="col">Data de abertura</th>
                  <th class="text-center" scope="col">Data Fechamento</th>
                  <th class="text-center" scope="col">Opções</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(i, index) in cashiers" :key="index" :id="i.id">
                  <td class="text-center">
                    {{ parseFloat(i.value).toFixed(2).replace(".", ",") }}
                  </td>
                  <td class="text-center">{{ i.created_at }}</td>
                  <td class="text-center">{{ i.updated_at }}</td>
                  <td class="text-center">
                    <!-- <b-icon
                      style="cursor: pointer"
                      @click="removeItem(index)"
                      variant="danger"
                      icon="trash-fill"
                      aria-hidden="true"
                    ></b-icon> -->
                    <button class="btn btn-secondary btn-sm mr-1" title="Todos" @click="getCashierInfo(i.id, 'T')">T</button>
                    <button class="btn btn-primary btn-sm mr-1" title="Balcão" @click="getCashierInfo(i.id, 'B')">B</button>
                    <button class="btn btn-success btn-sm mr-1" title="Delivery" @click="getCashierInfo(i.id, 'D')">D</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </b-col>

          <b-col cols="6">
          <!-- <b-row style="background-color:red; height:90%"> -->
          <div class="text-center">{{itemsCashierTitle}}</div>
          <div style="overflow-y: scroll; max-height: 87vh;">
            <table class="table table-striped" style="background-color: white">
              <thead>
                <tr>
                  <th scope="col">Produto</th>
                  <th class="text-center" scope="col">Preço X Quantidade</th>
                  <th class="text-center" scope="col">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(i, index) in items" :key="index">
                  <td>{{ i.name }}</td>
                  <td class="text-center"><strong>R$</strong> {{parseFloat(i.price).toFixed(2).replace(".", ",")}} <strong>X </strong>{{i.quantity}} <strong>Unds</strong></td>
                  <td class="text-center">{{ parseFloat(i.total).toFixed(2).replace(".", ",") }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          </b-col>
          <!-- </b-row> -->
        </b-row>
    <!-- </b-row> -->
  </div>
</template>

<script>
import { Product } from "../models/Product";
import { Payment } from "../models/Payment";
import { Cashier } from "../models/Cashier";
import { Order } from "../models/Order";
import { Item } from "../models/Item";
import { Customer } from "../models/Customer";
import { City } from "../models/City";
import { Address } from "../models/Address";
import { PaymentOrder } from "../models/PaymentOrder";
import { Helper } from "../models/Helper";
import EventBus from "../EventBus";
import { DB } from "../models/DB";
import Swal from "sweetalert2";
import { PaymentCashier } from '../models/PaymentCashier';
const product = new Product();
const customer = new Customer();
const city = new City();
const helper = new Helper();
const payment = new Payment();
const cashier = new Cashier();
const order = new Order();
const item = new Item();
const address_class = new Address();
const paymentOrder = new PaymentOrder();
const db = new DB();

export default {
  props: ["orderType"],
  data: () => ({
    cashiers: [],
    items:[],
    itemsCashierTitle:"Todos",
    cashier_id: null,
    type: null,
  }),

  async mounted() {
    EventBus.$on("change-tab", (e) => {
      
    });

    EventBus.$on("cashier-closed", async(e) => {
        this.getCashiers();
    });

    await this.getCashiers();
    if(this.cashiers.length > 0){
      this.items = await cashier.getCashierInfo(this.cashiers[0].id);
    }
  },

  methods: {
    async getCashierInfo(cashier_id, type = 'T'){
      if(type == 'B'){
        this.itemsCashierTitle = 'Balcão'
      }else if(type == 'D'){
        this.itemsCashierTitle = 'Delivery'
      }else{
        this.itemsCashierTitle = 'Todos'
      }
      
      this.cashier_id = cashier_id
      this.type = type
      this.items = await cashier.getCashierInfo(cashier_id, type)
    },

    async getCashiers(byDate = false) {
      if (byDate) {
        Swal.fire({
          title: "Buscar por data",
          html:
            '<input type="date" id="swal-input1" placeholder="Data inicial" class="swal2-input">' +
            '<input type="date" id="swal-input2" placeholder="Data final" class="swal2-input">',
          preConfirm: () => {
            let start = document.getElementById("swal-input1").value;
            let end = document.getElementById("swal-input2").value;

            if (start == "" || end == "") {
              Swal.showValidationMessage("Escolha data inicial e data final");
            } else {
              return [start, end];
            }
          },
        }).then(async (result) => {
          this.cashiers = await cashier.all(result.value);
        });
      } else {
        this.cashiers = await cashier.all();
      }
    },
  },
  watch: {
    items(){
      this.computedAmountItems
    }
  },

  computed: {
    async computedAmountItems(){
      let total = 0;
      // this.items.forEach((element) => {
      //   total += parseFloat(element.total);
      // });

      let detailPayments = await new PaymentCashier().paymentsForCashier(this.cashier_id, this.type)

      detailPayments.forEach(element => {
        total += parseFloat(element.total);
      });

      detailPayments.push({name: 'Total', total: total})
      EventBus.$emit("amount-computed-items", [total, detailPayments]);
      return parseFloat(total).toFixed(2);
    }
  },
};
</script>
