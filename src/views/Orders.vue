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
    <v-col cols="4" :style="{background:''}">
      <v-card v-if="delivery">
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
            <p class="text-center bold">Novo pedido</p>
            <v-text-field
              type="phone"
              counter="11"
              max-length="11"
              clearable
              v-model="customer.phone"
              label="Telefone"
            />
            <p class="inform">Digite um numero de telefone para iniciar um novo pedido</p>
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
      </v-card>
      <hr />
      <v-card :style="{'max-height': '870px', height:'870px'}" class="overflow-y-auto">
        <p align="center">Pedido</p>
        <u>
          <p
            v-if="updatingCustomer || newCustomer"
            align="center"
          >{{customer.name}} - {{customer.address}} - {{customer.phone}}</p>
        </u>
        <v-row class="pl-4 pr-4" v-for="(c, i) in cart" :key="i">
          <v-col cols="6">{{c.name}}</v-col>
          <v-col cols="2">{{c.quantity}}</v-col>
          <v-col cols="2">{{c.price}}</v-col>
          <v-col cols="2">{{c.price * c.quantity}}</v-col>
          <v-col cols="12">
            <hr />
          </v-col>
        </v-row>
      </v-card>
      <!-- menu -->
        <v-footer absolute class="font-weight-medium">
          <v-col class="text-center" cols="12">
            <v-row align="center">
              <v-col align="center" cols="6">
                <v-btn>Fechar</v-btn>
              </v-col>
              <v-col align="center" cols="6">
                <v-btn @click="cancelOrder">Cancelar</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-footer>
    </v-col>
  </v-row>

  <!-- </v-container> -->
</template>

<script>
import mixins from "../mixins/mixins";
import axios from "axios";
import { VMoney } from "v-money";
import sqlite3 from "sqlite3";
import globalShortcut from "electron";

const db = new sqlite3.Database(
  "/home/basis/Downloads/app-descktop/src/database/database.db"
);
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

  mounted() {
    window.addEventListener("keypress", e => {
      if (this.quantity > 0) {
        if (e.keyCode == 13) {
          console.log("Enter");
          this.insertInCart();
          this.$nextTick(() => this.$refs.product.focus());
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
    }
  },
  watch: {
    product(e) {
      this.$refs.quantity.focus();
    }
  },

  methods: {
    cancelOrder(){
      this.cart = []
    },
    cancelarForm() {
      this.locObj = {};
      this.customer = {};
      this.updatingCustomer = false;
      this.newCustomer = false;
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

      this.product = {};
      this.quantity = 0;
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
