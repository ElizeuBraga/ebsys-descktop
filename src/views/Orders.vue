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
        <v-card :class="[cartVibrate ? 'cart' : '']" elevation="10" height="95%" :style="{background: ''}">
          <!-- <v-icon>shopping_cart</v-icon> -->
          <v-card-title :style="{background:'', color:mainColor}" class="justify-center pb-0 pt-0">
            <b>{{deliveryTitle}}</b>
          </v-card-title>
          <v-row
            v-if="cart.length == 0"
            :style="{background:'', height:'600px'}"
            align="center"
            justify="space-around"
          >
            <v-icon :style="{opacity: 0.4}" :disabled="true" size="200" align="center">shopping_cart</v-icon>
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
              <a @click="cancelarForm"><v-icon>edit</v-icon></a>
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
              <v-icon v-if="indexPayment != -1" :color="paymentForm[indexPayment].color">{{paymentForm[indexPayment].icon}}</v-icon>
              <span v-else>Pagamento</span>
              <!-- <span>{{paymentForm[indexPayment].name}}</span> -->
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

      <!-- modal cliente -->
      <v-dialog v-model="dialog" width="500" :persistent="true">
        <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">Click Me</v-btn>
        </template>-->

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
              <v-col v-if="findingCustomer" cols="10">
                <v-btn
                  :style="{background:mainColor, color:'white'}"
                  rounded
                  @click="findCustomer"
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

      <!-- modal Receive-->
      <v-dialog v-model="dialogReceive" width="500" :persistent="false">
        <v-card>
          <v-card-title class="headline grey lighten-2 text-center" primary-title>{{formTitle}}</v-card-title>

          <v-card-text>
            <v-row justify="center">
              <v-text-field ref="receive" :color="mainColor" v-model="total"></v-text-field>
              <v-autocomplete
                ref="typePayment"
                v-model="typePayment"
                :items="payments"
                :loading="isLoading"
                :color="mainColor"
                hide-no-data
                hide-selected
                item-text="Description"
                item-value="API"
                placeholder="Forma de pagamento"
                prepend-icon="mdi-database-search"
                return-object
              ></v-autocomplete>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :style="{width:'100%', background: mainColor}"
              color="white"
              ref="endOrder"
              text
              @click="endOrder"
            >Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- rodapé -->
    <v-footer :style="{background: backgroundColor}" absolute class="font-weight-medium">
      <v-col class="text-center" cols="12">
        <v-row align="center">
          <v-col align="center" cols="4">
            <v-btn large :style="{color:'green'}">Normal</v-btn>
            <!-- <v-btn :style="{color:'white'}" :color="familyOrange[0]" large @click="receive">Receber</v-btn> -->
          </v-col>
          <v-col align="center" cols="4">
            <!-- <v-btn @click="cancelOrder" :style="{color: textColor}" color="red">Cancelar</v-btn> -->
            <v-btn large :style="{color:'red'}">Normal</v-btn>
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
import mixins from "../mixins/mixins";
import axios from "axios";
import { VMoney } from "v-money";
import sqlite3 from "sqlite3";
import globalShortcut, { dialog } from "electron";

// import hotkeys from 'hotkeys-js';

// hotkeys('f5', function(event, handler){
//   // Prevent the default refresh event under WINDOWS system
//   event.preventDefault() 
//   alert('you pressed F5!') 
// });
// const { Client } = require("pg");

const db = new sqlite3.Database(
  "/home/basis/Downloads/app-descktop/src/database/database.db"
);

// const client = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "postgres",
//   password: "postgres",
//   port: 5432
// });

var Pusher = require("pusher-js");

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;

var pusher = new Pusher("a885cc143df63df6146a", {
  cluster: "us2"
});

export default {
  mixins: [mixins],
  components: {},
  directives: { money: VMoney },
  data() {
    return {
      paymentForm:[
        {icon:'credit_card', name:'Crédito', color:'red'},
        {icon:'money', name:"Dinheiro", color:'green'},
        {icon:'credit_card', name:'Débito', color:'blue'}],
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
      money: {
        decimal: ",",
        thousands: ".",
        precision: 2,
        masked: false /* doesn't work with directive */
      },
      locality: [],
      sections: [
        { id: 1, name: "Bebidas" },
        { id: 2, name: "Pratos" }
      ],

      btnDesc: "Delivery",
      cart: [],
      newCustomer: false,
      updatingCustomer: false,
      findingCustomer: true,
      maskPhone: "(##)# ####-####",
      item: 5,
      customers: [],
      img: "",
      selected: {},
      dsc: "",
      products: [],
      loading: false,
      dialog: false,
      name: "",
      phone: "",
      price: "",
      locObj: {},
      address: "",
      alignment: "end",
      qtdDataReturned: 0,
      orders: [],
      order: {
        customer_id: 1,
        payment: "M"
      },
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
      rounded: false
    };
  },

  async mounted() {
    document.onkeydown = (e) => {
      
      if(e.keyCode === 113){
        if (this.indexPayment != -1) {
          console.log('Pode receber')
          return;
        }else{
          this.cartVibrate = true
        setTimeout(()=>{
          this.cartVibrate = false
        }, 600)
        }
      }

      if(e.keyCode == 116){
        this.changepaymentForm()
      }
    };
    this.typeOrderBalcao();
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
    this.loadLocality();
    this.loadProducts();
  },

  computed: {
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

    payments() {
      return this.paymentTypes.map(type => {
        const Description =
          type.name.length > this.descriptionLimit
            ? type.name.slice(0, this.descriptionLimit) + "..."
            : type.name;

        return Object.assign({}, type, { Description });
      });
    },

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
    quantity(e) {},

    product(e) {
      this.$refs.quantity.focus();
      // window.addEventListener("keypress", e => {
      //   if(e.keyCode == 13){
      //     this.openModalObs()
      //     console.log('oi')
      //   }
      // });
    },

    observation(e) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.observationSecond.focus();
        }, 200);
      });
    },

    typePayment(e) {
      // window.addEventListener("keypress", e => {
      //   this.$nextTick(() => {
      //     this.$refs.endOrder.focus();
      //   });
      // });
    }
  },

  methods: {
    changepaymentForm(){
      this.indexPayment += 1;

      if(this.indexPayment == 3){
        this.indexPayment = 0;
      }
    },
  
      theAction (event) {
        console.log(event)
    },

    async insertDeliveryRate(locality_id) {
      let sql = "select * from rates where locality_id = ? limit 1";
      await db.get(sql, locality_id, (err, row) => {
        if (err) {
          return console.log(err);
        }
        if (row) {
          this.product = row;
          this.cart.shift();
          this.insertInCart(true);
        }
      });
    },

    removeFromCart(i, parcialPrice) {
      this.total = this.total - parcialPrice;
      this.cart.splice(i, 1);
    },

    focusChanged(e) {
      console.log(e);
    },

    endOrder() {
      if (!this.delivery) {
        let rowid = null;
        this.order.payment = this.typePayment.id;
        this.order.cashier_id = 1;

        db.run("BEGIN TRANSACTION;");
        let sql =
          "insert into orders (payment, created_at, cashier_id) values(?,datetime('now'),?);";

        db.run(sql, [this.order.payment, this.order.cashier_id], err => {
          if (err) {
            return console.log(err.message);
          }

          console.log("Inseri o pedido");
        });

        let sql2 = "select last_insert_rowid() as rowid";
        db.get(sql2, (err, row) => {
          if (err) {
            return console.log(err);
          }
          let sql3 =
            "INSERT INTO itemsorders(quantity, product_id, order_id)values(?,?,?);";

          setTimeout(() => {
            this.cart.forEach(element => {
              db.run(sql3, [element.quantity, element.id, row.rowid], err => {
                if (err) {
                  return console.log(err);
                }
                console.log("Inseri os itens");
              });
            });
          }, 200);
        });

        db.run("COMMIT;");
      }
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

      this.insertInCart();

      this.dialogObs = false;

      setTimeout(() => {
        // this.$nextTick(() => {
        this.$refs.product.focus();
      }, 200);
      // });
    },

    typeOrderDelivery() {
      this.findingCustomer = true;
      this.updatingCustomer = false;
      this.dialog = true;
      this.delivery = true;
      this.deliveryTitle = "Entregas";
      this.btnDesc = "Balcão";
      this.cart = [];
      this.mainColor = "#90EE90";

      this.$root.$emit("change_color", this.mainColor);
    },

    typeOrderBalcao() {
      this.cancelOrder();
      this.customer = {};
      this.dialog = false;
      this.delivery = false;
      this.deliveryTitle = "Balcão";
      this.btnDesc = "Delivery";
      this.mainColor = "orange";
      this.$root.$emit("change_color", this.mainColor);
    },

    cancelOrder() {
      this.cart = [];
    },
    cancelarForm() {
      this.typeOrderBalcao();
      this.locObj = {};
      this.customer = {};
      this.updatingCustomer = false;
      this.newCustomer = false;
      this.findingCustomer = true;
      this.dialog = false;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    saveCustomer() {
      this.customer.locality_id = this.locObj.id;
      let sql =
        "INSERT INTO customers(name, phone, address, locality_id) VALUES (?,?,?,?)";
      db.run(
        sql,
        [
          this.customer.name,
          this.customer.phone,
          this.customer.address,
          this.customer.locality_id
        ],
        err => {
          if (err) {
            return console.log(err.message);
          }
          this.insertDeliveryRate(this.customer.locality_id);
          this.blockInputs = true;
          this.updatingCustomer = true;
          this.newCustomer = false;
          alert("Usuario salvo com sucesso");
        }
      );
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
          this.insertDeliveryRate(this.customer.locality_id);
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

    insertInCart(rate = false) {
      this.product.quantity = this.quantity;
      let prod = JSON.stringify(this.product);

      if (rate) {
        console.log("No inicio");
        this.cart.unshift(JSON.parse(prod));
      } else {
        this.cart.push(JSON.parse(prod));
      }

      this.total = 0;
      this.product = {};
      this.cart.forEach(element => {
        this.total += element.price * parseInt(element.quantity);
      });

      this.quantity = 1;
      this.$refs.product.focus();
    },

    async loadProducts() {
      let sql = "select * from products";
      await db.all(sql, (err, rows) => {
        if (err) {
          return console.log(err);
        }
        rows.forEach(row => {
          this.products.push(row);
        });
      });
    },

    async loadLocality() {
      await db.serialize(() => {
        db.each(`SELECT rowid, name FROM locality`, (err, row) => {
          if (err) {
            console.error(err.message);
          }
          this.locality.push(row);
        });
      });
    },

    async findCustomer() {
      let sql = "SELECT * FROM customers where phone=?";

      await db.get(sql, this.customer.phone, (err, row) => {
        if (err) {
          return console.log(err);
        }
        if (row) {
          this.dialog = false;
          // this.blockInputs = true;
          setTimeout(() => {
            this.updatingCustomer = true;
          }, 200);
          this.findingCustomer = false;
          this.customer = row;
          let sql = "SELECT * FROM locality where id=?";
          db.get(sql, row.locality_id, (err, row) => {
            this.locObj = row;
          });
          this.insertDeliveryRate(row.locality_id);
        } else {
          this.newCustomer = true;
          this.findingCustomer = false;
          this.blockInputs = false;
        }
      });
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
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
</style>
