<template>
  <!-- <v-container min-width="100%" :style="{background:'red'}"> -->
  <v-row justify="center" :style="{height:'94%', background:'#D2DAE2',  margin:'0px 4px 0px 4px'}">
    <v-col cols="8">
      <v-row>
        <v-col cols="8">
          <v-autocomplete
            ref="product"
            v-model="product"
            :items="items"
            :loading="isLoading"
            color="white"
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
        <v-col cols="4">
          <v-text-field label="Quantidade" ref="quantity" v-model="quantity" type="number" min="0" />
        </v-col>
      </v-row>
    </v-col>

    <!-- coluna do Pedido -->
    <v-col cols="4" :style="{background:''}">
      <v-card :style="{'max-height': '870px', height:'870px', background: orderColor}" class="overflow-y-auto">
        <v-card-title class="justify-center">{{deliveryTitle}}</v-card-title>
        <u>
          <p
            v-if="delivery"
            align="center"
          >{{customer.name}} - {{customer.address}} - {{customer.phone}}</p>
        </u>
        <v-row class="pl-4 pr-4 text-center" v-for="(c, i) in cart" :key="i">
          <v-col cols="6" class="text-left pt-0 pb-0">{{c.name}}</v-col>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-col v-bind="attrs" v-on="on" cols="2" class="pt-0 pb-0">{{c.quantity}}</v-col>
            </template>
            <span>Quantidade</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-col v-bind="attrs" v-on="on" cols="2" class="pt-0 pb-0">{{String(c.price).replace('.', ',')}}</v-col>
            </template>
            <span>Preço unitario</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-col v-bind="attrs" v-on="on" cols="2" class="pt-0 pb-0">{{String(c.price * c.quantity).replace('.', ',')}}</v-col>
            </template>
            <span>Total parcial</span>
          </v-tooltip>
          <v-col cols="12" class="text-left pt-0 pb-0">
            <span :style="{'font-size':'12px'}" v-for="(o, i) in c.observations" :key="i">
              <span v-if="i > 0">,</span>
              {{o}}
            </span>
          </v-col>
          <v-col cols="12">
            <hr />
          </v-col>
        </v-row>

        <v-card-actions :style="{position:'absolute', bottom:0, width:'100%'}">
            <v-col cols="6" class="text-center">Total</v-col>
            <v-col cols="6" class="text-center">{{total.toFixed(2).replace('.', ',')}}</v-col>
        </v-card-actions>
      </v-card>
      <!-- menu -->
      <v-footer absolute class="font-weight-medium">
        <v-col class="text-center" cols="12">
          <v-row align="center">
            <v-col align="center" cols="4">
              <v-btn color="primary">Receber</v-btn>
            </v-col>
            <v-col align="center" cols="4">
              <v-btn @click="cancelOrder" color="error">Cancelar</v-btn>
            </v-col>
            <v-col align="center" cols="4">
              <v-btn v-if="delivery" @click="typeOrderBalcao">{{btnDesc}}</v-btn>
              <v-btn v-else @click="typeOrderDelivery">{{btnDesc}}</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-footer>
    </v-col>
    <!-- coluna do Pedido -->

    <!-- observações -->
    <v-dialog v-model="dialogObs" width="500" :persistent="true">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">Click Me</v-btn>
      </template>

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
            color="black"
            hide-no-data
            hide-selected
            item-text="Description"
            item-value="API"
            placeholder="Selecione uma observação"
            prepend-icon="mdi-database-search"
            return-object
          ></v-autocomplete>
          <v-text-field ref="observationSecond" v-model="observationSecond" label="Observação"></v-text-field>
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
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">Click Me</v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2 text-center" primary-title>{{formTitle}}</v-card-title>

        <v-card-text>
          <v-row justify="center">
            <v-col v-if="newCustomer || updatingCustomer" cols="10">
              <p class="text-center bold">Novo cliente</p>
              <p class="text-center bold">{{message}}</p>
              <v-text-field :disabled="updatingCustomer" v-model="customer.phone" label="Telefone" />
              <v-text-field :disabled="blockInputs" v-model="customer.name" label="Nome" />
              <v-text-field :disabled="blockInputs" v-model="customer.address" label="Endereço" />
              <v-select
                :items="locality"
                return-object
                :disabled="blockInputs"
                item-text="name"
                item-value="rowId"
                v-model="locObj"
                label="Localidades"
              ></v-select>
              <v-row align="center">
                <v-col align="center" cols="6">
                  <u>
                    <a @click="cancelarForm">Cancelar</a>
                  </u>
                </v-col>
                <v-col align="center" cols="6">
                  <u>
                    <a @click="blockInputs = !blockInputs">Editar</a>
                  </u>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-else cols="10">
              <v-text-field
                type="phone"
                counter="11"
                max-length="11"
                clearable
                v-model="customer.phone"
                label="Telefone"
              />
            </v-col>
            <v-col v-if="newCustomer" cols="10">
              <v-btn
                :style="{background:myColor, color:'white'}"
                rounded
                @click="saveCustomer"
                label="Preço"
                width="100%"
                :disabled="inputs"
              >Salvar</v-btn>
            </v-col>
            <v-col v-if="updatingCustomer" cols="10">
              <v-btn
                :style="{background:myColor, color:'white'}"
                rounded
                @click="updateCustomer"
                label="Preço"
                width="100%"
                :disabled="inputs"
              >Atualizar</v-btn>
            </v-col>
            <v-col v-if="findingCustomer" cols="10">
              <v-btn
                :style="{background:myColor, color:'white'}"
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
          <v-btn color="primary" ref="btnOk" text @click="dialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  <!-- </v-container> -->
</template>

<script>
import mixins from "../mixins/mixins";
import axios from "axios";
import { VMoney } from "v-money";
import sqlite3 from "sqlite3";
import globalShortcut from "electron";
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
      deliveryTitle: "Balcão",
      total: 0,
      keyPressed: 0,
      observationSecond: "",
      obsSelected: false,
      observation: {},
      observations: [
        { name: "Suco", rowid: 1 },
        { name: "Coca", rowid: 2 }
      ],
      dialogObs: false,
      formTitle: "Buscar um cliente",
      dialog: false,
      delivery: false,
      quantity: 0,
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
        user: {}
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
    window.addEventListener("keypress", e => {
      if (this.quantity > 0) {
        if (e.keyCode == 13) {
          this.dialogObs = true;
          console.log("Enter");
          // if (this.keyPressed == 1) {
          //   console.log('ioooo')
          //   return this.$nextTick(() => this.$refs.btnOk.focus());
          // }
          setTimeout(() => {
            this.$nextTick(() => {
              // this.keyPressed = 1
              this.$refs.observation.focus();
            });
          }, 100);
        }
      }
    });
    // this.loadLocality();
    this.loadProducts();
  },

  computed: {
    inputs() {
      return (
        !this.customer.phone ||
        !this.customer.name ||
        !this.customer.address ||
        this.blockInputs
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
    product(e) {
      this.$refs.quantity.focus();
    },

    observation(e) {
      this.obsSelected = true;
    }
  },

  methods: {
    updateCart(item) {
      console.log(item);
    },
    saveObs() {
      this.product.observations = [];
      this.product.observations.push(this.observation.name);
      if (this.observationSecond != "") {
        this.product.observations.push(this.observationSecond);
      }

      this.insertInCart();

      this.dialogObs = false;
    },
    typeOrderDelivery() {
      this.dialog = true;
      this.delivery = true;
      this.deliveryTitle = "Delivery"
      this.btnDesc = "Balcão"
      this.orderColor = 'red'

      this.$root.$emit('change_color', this.orderColor)
    },

    typeOrderBalcao(){
      this.customer = {}
      this.dialog = false;
      this.delivery = false;
      this.deliveryTitle = "Balcão"
      this.btnDesc = "Delivery"
      this.orderColor = 'blue'
      this.$root.$emit('change_color', this.orderColor)
    },

    cancelOrder() {
      this.cart = [];
    },
    cancelarForm() {
      this.locObj = {};
      this.customer = {};
      this.updatingCustomer = false;
      this.newCustomer = false;
      this.findingCustomer = true;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    saveCustomer() {
      this.customer.locality_id = this.locObj.rowid;
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
          this.blockInputs = true;
          this.updatingCustomer = true;
          this.newCustomer = false;
          alert("Usuario salvo com sucesso");
        }
      );
    },

    updateCustomer() {
      this.customer.locality_id = this.locObj.rowid;
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
          this.blockInputs = true;
          alert("Cliente atualizado!");
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

    insertInCart() {
      this.product.quantity = this.quantity;
      let prod = JSON.stringify(this.product);
      this.cart.push(JSON.parse(prod));

      this.total = 0
      this.product = {};
      this.quantity = 0;
      let parcial = []

      this.cart.forEach(element => {
          this.total += element.price * parseInt(element.quantity)
      });

      // this.cart.forEach(element => {
      //   parcial.push(element.price * parseInt(element.quantity));
      // });

      // parcial.forEach(element => {
      //   this.total += element 
      // });

      // console.log(parcial)
    },

    async loadProducts() {
      await db.serialize(() => {
        db.each(`SELECT * FROM products`, (err, row) => {
          if (err) {
            console.error(err.message);
          }
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
          this.blockInputs = true;
          console.log("Encontrei");
          this.updatingCustomer = !this.updatingCustomer;
          this.customer = row;
          let sql = "SELECT * FROM locality where rowid=?";
          db.get(sql, row.locality_id, (err, row) => {
            this.locObj = row;
          });
        } else {
          console.log("Não encontrei");
          this.newCustomer = !this.newCustomer;
          this.blockInputs = false;
        }
        this.findingCustomer = false;
      });
    }
  }
};
</script>
<style scoped>
.inform {
  font-size: 12px;
  text-align: center;
  color: red;
}
</style>
