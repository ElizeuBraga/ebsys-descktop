<template>
  <v-container fill-height fluid :style="{background:backgroundColor, 'align-items': 'stretch'}">
    <v-row :style="{background:backgroundColor, height:'93%'}">
      <v-col cols="5">
        <v-autocomplete
          ref="product"
          v-model="product"
          :items="items"
          :loading="isLoading"
          :color="mainColor"
          hide-no-data
          hide-selected
          item-text="Description"
          item-value="API"
          label="Buscar um produto"
          placeholder="Digite algo para buscar um produto"
          prepend-icon="mdi-database-search"
          return-object
        ></v-autocomplete>
      </v-col>
      <v-col cols="2">
        <v-text-field
          :color="mainColor"
          label="Quantidade"
          ref="quantity"
          v-model="quantity"
          type="number"
          min="1"
        />
      </v-col>

      <!-- coluna do Pedido inicio-->

      <v-col cols="5" :style="{background:backgroundColor}">
        <v-card
          :class="[cartVibrate ? '' : '']"
          elevation="10"
          height="95%"
          :style="{background: ''}"
        >
          <!-- <v-icon>shopping_cart</v-icon> -->
          <v-card-title :style="{background:'', color:mainColor}" class="justify-center pb-0 pt-0">
            <b>{{deliveryTitle}}</b>
          </v-card-title>
          <v-alert
            :value="error"
            class="ml-2 mr-2"
            transition="scale-transition"
            type="error"
          >{{msg}}</v-alert>
          <v-alert
            :value="success"
            class="ml-2 mr-2"
            transition="scale-transition"
            type="success"
          >{{msg}}</v-alert>
          <v-row
            v-if="cart.length == 0"
            :style="{background:'', height:'600px'}"
            align="center"
            justify="space-around"
          >
            <v-col cols="12" align="center">
              <v-icon
                :style="{opacity: 0.4}"
                :disabled="true"
                size="200"
                align="center"
              >shopping_cart</v-icon>
            </v-col>
          </v-row>
          <!-- <u v-if="delivery && customer.name != null"> -->
          <v-row v-if="delivery && customer.name != null" align="center" class="pb-0 pt-0">
            <v-col cols="10" align="center">
              <span>{{customer.name}} - {{customer.address}} - {{customer.phone}}</span>
            </v-col>
            <v-col align="center" cols="1" class="pb-0 pt-0">
              <a @click="dialog = true">
                <v-icon>edit</v-icon>
              </a>
            </v-col>
            <v-col align="center" cols="1" class="pb-0 pt-0">
              <a @click="cancelarForm">
                <v-icon>edit</v-icon>
              </a>
            </v-col>
          </v-row>
          <!-- <hr/> -->
          <br />
          <!-- </u> -->
          <v-row class="pl-6 pr-6">
            <v-row class="pl-1 pr-1 text-center" v-for="(c, i) in cart" :key="i">
              <v-col cols="4" class="text-left pt-0 pb-0">{{c.name}}</v-col>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-col v-bind="attrs" v-on="on" cols="2" class="pt-0 pb-0">{{c.quantity}}</v-col>
                </template>
                <span>Quantidade</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-col
                    v-bind="attrs"
                    v-on="on"
                    cols="2"
                    class="pt-0 pb-0"
                  >{{String(c.price).replace('.', ',')}}</v-col>
                </template>
                <span>Preço unitario</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-col
                    v-bind="attrs"
                    v-on="on"
                    cols="2"
                    class="pt-0 pb-0"
                  >{{String(c.price * c.quantity).replace('.', ',')}}</v-col>
                </template>
                <span>Total parcial</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-col v-on="on" cols="2" class="pt-0 pb-0" v-bind="attrs">
                    <a
                      v-if="c.name != 'Taxa de entrega'"
                      @click="removeFromCart(i, (c.price * c.quantity))"
                    >
                      <v-icon color="red" align="center">remove_circle_outline</v-icon>
                    </a>
                  </v-col>
                </template>
                <span>Remover</span>
              </v-tooltip>
              <v-col cols="9" class="text-left pt-0 pb-0">
                <span :style="{'font-size':'12px'}" v-for="(o, i) in c.observations" :key="i">
                  <span v-if="i > 0">,</span>
                  {{o}}
                </span>
              </v-col>
              <!-- <v-col cols="3" class="pt-0 pb-0">
                <a
                  v-if="c.name != 'Taxa de entrega'"
                  @click="removeFromCart(i, (c.price * c.quantity))"
                >
                  <v-icon align="center">remove_circle_outline</v-icon>
                </a>
              </v-col>-->
              <v-col class="pt-0 pb-0 pr-0 pl-0" cols="12">
                <hr />
              </v-col>
            </v-row>
          </v-row>

          <v-card-actions
            :style="{'font-size': '20px', color:mainColor, position:'absolute', bottom:0, width:'100%'}"
          >
            <v-col cols="4" class="text-center">
              <b>Total</b>
            </v-col>
            <v-col cols="4" class="text-center">
              <b>R$ {{total.toFixed(2).replace('.', ',')}}</b>
            </v-col>
          </v-card-actions>
        </v-card>
        <!-- menu -->
      </v-col>
      <!-- coluna do Pedido -->
      <!-- observações -->
      <v-dialog v-model="dialogObs" width="500" :persistent="true">
        <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">Click Me</v-btn>
        </template>-->

        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Observações</v-card-title>

          <v-card-text>
            <!-- <v-select
                ref="observation"
                :items="observations"
                return-object
                placeholder="Selecione um item"
                :disabled="blockInputs"
                item-text="name"
                item-value="rowId"
                v-model="observation"
                label="Observações"
            ></v-select>-->
            <v-autocomplete
              ref="observation"
              v-model="observation"
              :items="obs"
              :loading="isLoading"
              :color="mainColor"
              hide-no-data
              hide-selected
              item-text="Description"
              item-value="API"
              placeholder="Selecione uma observação"
              prepend-icon="mdi-database-search"
              return-object
            ></v-autocomplete>
            <v-text-field
              :color="mainColor"
              ref="observationSecond"
              v-model="observationSecond"
              label="Observação"
            ></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="saveObs">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal find customer -->
      <v-dialog v-model="modalFindCustomer" width="500" :persistent="true">
        <v-card>
          <v-card-title class="headline grey lighten-2 text-center" primary-title>Buscar cliente</v-card-title>
          <v-card-text>
            <v-row justify="center">
              <v-col cols="10">
                <v-text-field
                  ref="phone"
                  type="phone"
                  counter="11"
                  max-length="11"
                  clearable
                  :color="mainColor"
                  v-model="customer.phone"
                  label="Telefone"
                />
              </v-col>
              <v-col cols="10">
                <v-btn
                  :style="{background:mainColor, color:'white'}"
                  rounded
                  @click="findCustomer(customer.phone)"
                  label="Preço"
                  width="100%"
                  :disabled="!customer.phone"
                >Buscar</v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="updatingCustomer"
              color="primary"
              ref="btnOk"
              text
              @click="dialog = false"
            >Cancelar</v-btn>
            <v-btn v-else color="primary" ref="btnOk" text @click="cancelarForm">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal new  cliente or update cliente -->
      <v-dialog v-model="modalCustomer" width="500" :persistent="true">
        <v-card>
          <v-card-title class="headline grey lighten-2 text-center" primary-title>{{formTitle}}</v-card-title>

          <v-card-text>
            <v-row justify="center">
              <v-col v-if="newCustomer || updatingCustomer" cols="10">
                <p class="text-center bold">Novo cliente</p>
                <p class="text-center bold">{{message}}</p>
                <v-text-field
                  :color="mainColor"
                  :disabled="updatingCustomer"
                  v-model="customer.phone"
                  label="Telefone"
                />
                <v-text-field
                  :color="mainColor"
                  :disabled="blockInputs"
                  v-model="customer.name"
                  label="Nome"
                />
                <v-text-field
                  :color="mainColor"
                  :disabled="blockInputs"
                  v-model="customer.address"
                  label="Endereço"
                />
                <v-select
                  :color="mainColor"
                  :items="locality"
                  return-object
                  :disabled="blockInputs"
                  item-text="name"
                  item-value="rowId"
                  v-model="locObj"
                  label="Localidades"
                ></v-select>
              </v-col>
              <v-col v-else cols="10">
                <v-text-field
                  ref="phone"
                  type="phone"
                  counter="11"
                  max-length="11"
                  clearable
                  :color="mainColor"
                  v-model="customer.phone"
                  label="Telefone"
                />
              </v-col>
              <v-col v-if="newCustomer" cols="10">
                <v-btn
                  :style="{background:color, color:'white'}"
                  rounded
                  @click="saveCustomer"
                  label="Preço"
                  width="100%"
                  :disabled="inputs"
                >Salvar</v-btn>
              </v-col>
              <v-col v-if="updatingCustomer" cols="10">
                <v-btn
                  :style="{background:mainColor, color:'white'}"
                  rounded
                  @click="updateCustomer"
                  label="Preço"
                  width="100%"
                  :disabled="inputs"
                >Atualizar</v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="updatingCustomer"
              color="primary"
              ref="btnOk"
              text
              @click="dialog = false"
            >Cancelar</v-btn>
            <v-btn v-else color="primary" ref="btnOk" text @click="cancelarForm">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal Receive-->
      <v-dialog v-model="dialogReceive" width="500" :persistent="false">
        <v-card>
          <v-card-title class="headline grey lighten-2 text-center" primary-title>{{formTitle}}</v-card-title>

          <v-card-text>
            <v-row justify="center">
              <v-col cols="6">
                <v-text-field ref="receive" :color="mainColor" v-model="totalToReceive"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                  ref="payment"
                  v-model="payment"
                  :items="paymentsFormats"
                  :loading="isLoading"
                  :color="mainColor"
                  hide-no-data
                  item-text="name"
                  item-value="API"
                  placeholder="Forma de pagamento"
                  prepend-icon="mdi-database-search"
                  return-object
                ></v-select>
              </v-col>
              <div>
                <span
                  cols="4"
                  v-for="(p, i) in payments"
                  :key="i"
                >{{p.name}} - {{p.price.toFixed(2).replace('.', ',')}}</span>
                <br />
              </div>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :style="{width:'100%', background: mainColor}"
              color="white"
              ref="btnendorder"
              text
              @click="endOrder(order, cart, payments)"
            >Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal close cahiser-->
      <v-dialog v-model="modalCloseCashier" width="500" :persistent="false">
        <v-card>
          <v-card-title class="headline grey lighten-2 text-center" primary-title>Fechar caixa</v-card-title>

          <v-card-text>
            <v-row justify="center">
              <v-col cols="6">
                <v-text-field
                  maxlength="7"
                  :color="mainColor"
                  v-money="money"
                  label="Dinheiro"
                  v-model="cashier.money"
                ></v-text-field>
                <v-text-field
                  maxlength="7"
                  :color="mainColor"
                  v-money="money"
                  label="Débito"
                  v-model="cashier.credit"
                ></v-text-field>
                <v-text-field
                  maxlength="7"
                  :color="mainColor"
                  v-money="money"
                  label="Crédito"
                  v-model="cashier.debit"
                ></v-text-field>
                <v-text-field
                  maxlength="7"
                  :color="mainColor"
                  v-money="money"
                  label="Ticket"
                  v-model="cashier.ticket"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :style="{width:'100%', background: mainColor}"
              color="white"
              ref="btnendorder"
              text
              @click="closeCashier(cashier)"
            >Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal login -->
      <v-dialog v-model="unlogged" width="500" :persistent="true">
        <v-card>
          <v-card-title class="headline grey lighten-2 text-center" primary-title>Login</v-card-title>

          <v-card-text>
            <v-row justify="center">
              <v-col cols="12">
                <v-text-field
                  :ref="'username'"
                  label="Telefone ou email"
                  :color="mainColor"
                  v-model="username"
                ></v-text-field>
                <v-text-field
                  ref="password"
                  type="password"
                  label="Senha"
                  :color="mainColor"
                  v-model="password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-alert
            :value="msgLogin"
            class="ml-2 mr-2"
            transition="scale-transition"
            type="error"
          >{{msgloginerror}}</v-alert>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :style="{width:'100%', background: mainColor}"
              color="white"
              ref="btnendorder"
              text
              :disabled="fieldsLogin"
              @click="login(username, password)"
            >Entrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal reset password -->
      <v-dialog v-model="resetpassword" width="500" :persistent="true">
        <v-card>
          <v-card-title class="headline grey lighten-2 text-center" primary-title>Trocar senha</v-card-title>

          <v-card-text>
            <v-row justify="center">
              <v-col cols="12">
                <v-text-field
                  ref="receive"
                  label="Senha"
                  :color="mainColor"
                  v-model="password"
                  type="password"
                ></v-text-field>
                <v-text-field
                  ref="receive"
                  type="password"
                  label="Confirme a senha"
                  :color="mainColor"
                  v-model="confirm_password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-alert
            :value="msgLogin"
            class="ml-2 mr-2"
            transition="scale-transition"
            type="error"
          >{{msgloginerror}}</v-alert>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :style="{width:'100%', background: mainColor}"
              color="white"
              ref="btnendorder"
              text
              :disabled="password == '' || confirm_password == ''"
              @click="resetPassword(password, confirm_password)"
            >Entrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- rodapé -->
    <v-footer :style="{background: backgroundColor}" absolute class="font-weight-medium">
      <v-col class="text-center" cols="12">
        <v-row align="center">
          <v-col align="center" cols="4">
            <v-btn
              v-if="!statusCashier"
              @click="openCashier(loggedUser)"
              large
              :style="{color:'green'}"
            >Abrir</v-btn>
            <v-btn
              v-else
              @click="modalCloseCashier = true"
              large
              :style="{color:'red'}"
            >Fechar caixa</v-btn>
            <!-- <v-btn :style="{color:'white'}" :color="familyOrange[0]" large @click="receive">Receber</v-btn> -->
          </v-col>
          <v-col align="center" cols="4">
            <!-- <v-btn @click="cancelOrder" :style="{color: textColor}" color="red">Cancelar</v-btn> -->
            <!-- <v-btn large :style="{color:'red'}">Normal</v-btn> -->
            <span v-if="loggedUser.name != undefined">Caixa aberto por {{loggedUser.name}}</span>
          </v-col>
          <v-col align="center" cols="4">
            <v-btn v-if="delivery" large :style="{color:'blue'}" @click="typeOrderBalcao">Balcão</v-btn>
            <!-- <v-btn
              :style="{color:'white'}"
              color="#0F8DB8"
              v-if="delivery"
              @click="typeOrderBalcao"
            >{{btnDesc}}</v-btn>-->
            <v-btn v-else large :style="{color:'blue'}" @click="typeOrderDelivery">Entregas</v-btn>
            <!-- <v-btn
              :style="{color:'white'}"
              color="#6B64EB"
              v-else
              @click="typeOrderDelivery"
            >{{btnDesc}}</v-btn>-->
          </v-col>
        </v-row>
      </v-col>
    </v-footer>
  </v-container>
</template>


<script>
// class Product{
//   index(){
//     return "All products";
//   }
// }

import mixins from "../mixins/mixins";
import axios from "axios";
import { VMoney } from "v-money";
import sqlite3 from "sqlite3";
import globalShortcut, { dialog } from "electron";
import { ProductController } from "../controllers/ProductController";
import { LocalityController } from "../controllers/LocalityController";
import { OrderController } from "../controllers/OrderController";
import { ItemController } from "../controllers/ItemController";
import { CashierController } from "../controllers/CashierController";
import { PaymentController } from "../controllers/PaymentController";
import { CustomerController } from "../controllers/CustomerController";
import { UserController } from "../controllers/UserController";
import bcryptjs from "bcryptjs";

const db = new sqlite3.Database(
  "/home/basis/Downloads/app-descktop/src/database/database.db"
);

var Pusher = require("pusher-js");

var pusher = new Pusher("a885cc143df63df6146a", {
  cluster: "us2"
});

export default {
  mixins: [mixins],
  components: {},
  directives: { money: VMoney },
  data() {
    return {
      money: {
        decimal: ",",
        thousands: ".",
        // prefix: "R$ ",
        // suffix: " / SCU",
        precision: 2,
        masked: false, // doesn't work with directive
        // Waiting on https://github.com/vuejs-tips/v-money/pull/51 to be merged
        allowBlank: true
        // Waiting on https://github.com/vuejs-tips/v-money/pull/36 to be merged
        // max: 999.99,
        // min: 0.01
        // Also bugged that this is not clearable
        // https://github.com/vuejs-tips/v-money/issues/44
      },
      //payments
      statusCashier: false,
      payment: {},
      payments: [],
      paymentsFormats: [
        { id: 1, name: "Dinheiro" },
        { id: 2, name: "Débito" },
        { id: 3, name: "Crédito" },
        { id: 4, name: "Ticket" }
      ],
      totalToReceive: 0,
      paymentForm: [
        { id: 1, name: "Dinheiro" },
        { id: 2, name: "Débito" },
        { id: 3, name: "Crédito" }
      ],

      cashier: {
        debit: "0,00",
        credit: "0,00",
        ticket: "0,00",
        money: "0,00"
      },
      unlogged: true,
      error: false,
      success: false,
      alert: false,
      msg: "",
      indexPayment: -1,
      typePayment: {},
      paymentTypes: [
        { id: "M", name: "Dinheiro" },
        { id: "D", name: "Débito" },
        { id: "C", name: "Crédito" }
      ],
      deliveryTitle: "Balcão",
      cartVibrate: false,
      total: 0,
      keyPressed: 0,
      observationSecond: "",
      obsSelected: false,
      observation: {},
      observations: [
        { name: "Suco", rowid: 1 },
        { name: "Coca", rowid: 2 }
      ],
      modalCloseCashier: false,
      dialogReceive: false,
      dialogObs: false,
      formTitle: "Buscar um cliente",
      dialog: false,
      delivery: false,
      quantity: 1,
      product: {},
      isLoading: false,
      customer: {},
      blockInputs: false,
      descriptionLimit: 60,
      modalFindCustomer: false,
      user: null,
      username: "",
      password: "",
      confirm_password: "",
      locality: [],
      sections: [
        { id: 1, name: "Bebidas" },
        { id: 2, name: "Pratos" }
      ],

      dialogCustomer: false,
      btnDesc: "Delivery",
      cart: [],
      newCustomer: false,
      updatingCustomer: false,
      findingCustomer: true,
      maskPhone: "(##)# ####-####",
      item: 5,
      resetpassword: false,
      customers: [],
      img: "",
      selected: {},
      dsc: "",
      products: [],
      loading: false,
      dialog: false,
      name: "",
      msgloginerror: "",
      phone: "",
      price: "",
      locObj: {},
      modalCustomer: false,
      address: "",
      alignment: "end",
      qtdDataReturned: 0,
      orders: [],
      order: {},
      isEditing: false,
      message: "",
      userExists: false,
      disabled: false,
      dense: false,
      twoLine: false,
      threeLine: true,
      shaped: false,
      flat: false,
      subheader: false,
      inactive: false,
      subGroup: false,
      nav: false,
      avatar: false,
      rounded: false,
      teste: false
    };
  },

  async mounted() {
    this.typeOrderBalcao();

    this.$root.$on("logout", e => {
      this.unlogged = e;
      this.password = "";
    });

    //cashier status
    this.cashierStatus();

    //load products
    var p = new ProductController();
    this.products = await p.index();

    // load localities
    var l = new LocalityController();
    this.locality = await l.index();

    //keyboard events
    document.onkeydown = e => {
      if (e.keyCode == 13 && this.dialogReceive) {
        this.$refs.payment.focus();
      }

      if (e.keyCode == 13 && this.dialogReceive && this.totalToReceive == 0) {
        this.endOrder(this.order, this.cart);
      }

      if (e.keyCode == 13 && Object.keys(this.product).length > 0) {
        if (!this.cashier.created_at) {
          // this.$refs.quantity.focus();
          this.showMessageError("Caixa fechado");
          this.product = {};
          return;
        }
        this.$refs.quantity.focus();
      }

      if (e.keyCode == 13 && Object.keys(this.payment).length > 0) {
        let payment = new PaymentController();
        let result = payment.calcPayment(
          parseFloat(this.totalToReceive),
          this.payment
        );
        this.payments.push(JSON.parse(JSON.stringify(result)));

        let calcResult = 0;
        this.payments.forEach(element => {
          calcResult += element.price;
        });

        this.totalToReceive = this.total - calcResult;
        this.payment = {};
        if (this.totalToReceive == 0) {
          this.$refs.btnendorder.$el.focus();
        }
      }

      if (e.keyCode === 113) {
        if (this.indexPayment != -1) {
          console.log("Pode receber");
          return;
        } else {
          this.cartVibrate = true;
          setTimeout(() => {
            this.cartVibrate = false;
          }, 600);
        }
      }

      if (e.keyCode == 116 && !this.unlogged) {
        if (this.delivery) {
          this.typeOrderBalcao();
          setTimeout(() => {
            this.$refs.product.focus();
          }, 200);
        } else {
          this.typeOrderDelivery();
          setTimeout(() => {
            this.$refs.phone.focus();
          }, 200);
        }
      }

      if (e.keyCode === 112) {
        if (
          this.cart.length == 0 ||
          localStorage.getItem("cashier_id") == "null"
        ) {
          if (localStorage.getItem("cashier_id") == "null") {
            this.showMessageError("Caixa fechado");
          } else {
            this.showMessageError("Sem itens para pedido");
          }
          this.cartVibrate = true;
          setTimeout(() => {
            this.cartVibrate = false;
          }, 600);

          return;
        }
        setTimeout(() => {
          this.$refs.receive.focus();
        }, 200);
        this.totalToReceive = this.total;
        this.formTitle = "Receber";
        this.dialogReceive = true;
      }

      if (e.keyCode == 116) {
        this.changepaymentForm();
      }
    };

    window.addEventListener("keypress", e => {
      if (e.keyCode == 13) {
        if (this.observationSecond != "") {
          // this.dialogObs = true;
          this.saveObs();
        }
        if (this.quantity >= 1 && Object.keys(this.product).length > 0) {
          this.dialogObs = true;
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.observation.focus();
            });
          }, 200);
        }
      }
    });
  },

  computed: {
    fieldsLogin() {
      return this.username == "" || this.password == "";
    },

    priceInField() {},

    msgLogin() {
      return this.msgloginerror != "";
    },

    inputs() {
      return (
        !this.customer.phone ||
        !this.customer.name ||
        !this.customer.address ||
        this.blockInputs ||
        Object.keys(this.locObj).length === 0
      );
    },
    items() {
      return this.products.map(product => {
        const Description =
          product.name.length > this.descriptionLimit
            ? product.name.slice(0, this.descriptionLimit) + "..."
            : product.name;

        return Object.assign({}, product, { Description });
      });
    },

    // payments() {
    //   return this.paymentTypes.map(type => {
    //     const Description =
    //       type.name.length > this.descriptionLimit
    //         ? type.name.slice(0, this.descriptionLimit) + "..."
    //         : type.name;

    //     return Object.assign({}, type, { Description });
    //   });
    // },

    obs() {
      return this.observations.map(obs => {
        const Description =
          obs.name.length > this.descriptionLimit
            ? obs.name.slice(0, this.descriptionLimit) + "..."
            : obs.name;

        return Object.assign({}, obs, { Description });
      });
    }
  },
  watch: {
    typePayment(e) {
      e.price = this.totalToReceive;
      let val = JSON.stringify(e);
      this.paymentForm.push(JSON.parse(val));
      this.totalToReceive = this.total - this.totalToReceive;
    },

    quantity(e) {},

    observation(e) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.observationSecond.focus();
        }, 200);
      });
    }
  },

  methods: {
    async cashierStatus() {
      var cashier = new CashierController();
      let response = await cashier.show();
      this.cashier = response;
      if (this.cashier.created_at) {
        this.statusCashier = true;
        return true;
      } else {
        this.statusCashier = false;
        return false;
      }
    },

    resetPassword(password, confirm_password) {
      setTimeout(() => {
        this.msgloginerror = "";
      }, 3000);
      if (password != confirm_password) {
        this.msgloginerror = "Senhas não conferem";
        return;
      }
      let u = {
        password: password,
        id: this.loggedUser.id
      };
      let user = new UserController();
      user.update(u);
      this.resetpassword = false;
      this.showMessageSucess("Senha alterada com sucesso");
    },

    async login(usr, password) {
      let user = new UserController();
      let result = await user.login(usr, password);

      bcryptjs.compare(password, result.password, (err, res) => {
        if (res === true) {
          this.loggedUser = result;
          this.unlogged = false;
          this.$root.$emit("logged_user", result);
          this.$refs.product.focus();
          if (result.updated_at === null) {
            this.resetpassword = true;
            this.password = "";
          }
        } else {
          this.msgloginerror = "Usuario ou senha estão incorretos";
          setTimeout(() => {
            this.msgloginerror = "";
          }, 3000);
        }
      });
    },

    openCashier(loggedUser) {
      let cashier = new CashierController();
      cashier.store(loggedUser);
      this.cashierStatus();
    },

    closeCashier(c) {
      let cashier = new CashierController();
      cashier.update(c);
      this.cashierStatus();

      this.modalCloseCashier = false
    },

    changePayment(f) {
      console.log(f);
      f.color = "red";
    },

    changepaymentForm() {
      this.indexPayment += 1;

      if (this.indexPayment == 3) {
        this.indexPayment = 0;
      }
    },

    theAction(event) {
      console.log(event);
    },

    removeFromCart(i, parcialPrice) {
      this.total = this.total - parcialPrice;
      this.cart.splice(i, 1);
    },

    focusChanged(e) {
      console.log(e);
    },

    clearAll() {
      (this.cart = []), (this.order = {});
    },

    endOrder(order, items, payments) {
      order.cashier_id = this.cashier.id;
      if (!this.delivery) {
        order.order_type = 0;
      } else {
        order.customer_id = this.customer.id;
        order.order_type = 1;
      }
      let o = new OrderController();
      o.store(order, items, payments);
      this.dialogReceive = false;
      this.cart = [];
      this.customer = {};
      this.typeOrderBalcao();
    },
    receive() {
      if (this.total > 0) {
        this.dialogReceive = true;
      }

      this.formTitle = "Receber";
    },

    updateCart(item) {
      console.log(item);
    },
    saveObs() {
      this.product.observations = [];
      this.product.observations.push(this.observation.name);
      if (this.observationSecond != "") {
        this.product.observations.push(this.observationSecond);
      }

      this.observationSecond = "";
      this.observation = {};

      this.insertInCart(this.product);

      this.dialogObs = false;

      setTimeout(() => {
        // this.$nextTick(() => {
        this.$refs.product.focus();
      }, 200);
      // });
    },

    typeOrderDelivery() {
      this.delivery = true;
      this.deliveryTitle = "Entregas";
      this.btnDesc = "Balcão";
      this.cart = [];
      this.mainColor = "greenyellow";
      this.modalFindCustomer = true;

      this.$root.$emit("change_color", this.mainColor);
    },

    typeOrderBalcao() {
      this.cancelOrder();
      this.customer = {};
      this.delivery = false;
      this.deliveryTitle = "Balcão";
      this.btnDesc = "Delivery";
      this.mainColor = "orange";
      this.$root.$emit("change_color", this.mainColor);
      this.modalFindCustomer = false;
    },

    cancelOrder() {
      this.cart = [];
      this.total = 0;
      this.product = {};
      this.dialogObs = false;
    },
    cancelarForm() {
      this.typeOrderBalcao();
      this.locObj = {};
      this.customer = {};
      this.modalFindCustomer = false;
      this.modalCustomer = false;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    async saveCustomer() {
      setTimeout(() => {
        this.success = false;
        this.error = false;
      }, 3000);
      this.customer.locality_id = 1;
      let customer = new CustomerController();
      let result = await customer.store(this.customer);

      if (result === true) {
        this.success = true;
        this.msg = "Salvo com sucesso!";
      } else {
        this.error = true;
        if (result == 19) {
          this.msg = "Usuario já existe!";
        } else {
          this.msg = "Erro inesperado. Codigo " + result;
        }
      }
      this.modalCustomer = false;
    },

    updateCustomer() {
      this.customer.locality_id = this.locObj.id;
      let sql =
        "UPDATE customers SET name = ?, address = ?, locality_id = ? where phone = ?";
      db.run(
        sql,
        [
          this.customer.name,
          this.customer.address,
          this.customer.locality_id,
          this.customer.phone
        ],
        err => {
          if (err) {
            return console.log(err.message);
          }
          // get the last insert id
          // this.blockInputs = true;
          alert("Cliente atualizado!");
          this.dialog = false;
        }
      );
    },

    save() {
      axios
        .post(this.host + "products", {
          name: this.name,
          price: parseFloat(this.price),
          section_id: this.selected.id,
          img: this.img,
          dsc: this.dsc
        })
        .then(function(response) {
          console.log(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    show(p) {
      this.order = p;
    },

    insertInCart(product) {
      product.quantity = this.quantity;
      let prod = JSON.stringify(product);
      this.cart.push(JSON.parse(prod));

      this.total = 0;
      this.product = {};
      this.cart.forEach(element => {
        this.total += element.price * parseInt(element.quantity);
      });

      this.quantity = 1;
      this.$refs.product.focus();
    },

    async findCustomer(phone) {
      let customer = new CustomerController();
      let customerresult = await customer.show(phone);
      if (customerresult != undefined) {
        this.customer = customerresult;
        this.modalFindCustomer = false;
        let p2 = new ProductController();
        let result = await p2.showByLocality(customerresult.locality_id);
        this.insertInCart(result);

        return;
      }

      this.modalFindCustomer = false;
      this.modalCustomer = true;
      this.newCustomer = true;
    }
  }
};
</script>
<style scoped>
/* .inform {
  font-size: 12px;
  text-align: center;
  color: red;
} */

.cart {
  animation: shake 0.5s;
  animation-iteration-count: infinite;
  background: gray;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
