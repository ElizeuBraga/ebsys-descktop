<template>
  <!-- <v-container min-width="100%" :style="{background:'red'}"> -->
  <v-row justify="center" :style="{background:'',  margin:'0px 4px 0px 4px'}">
    <v-col cols="8" :style="{background:'red'}">
      <v-simple-table height="89vh">
        <v-progress-linear indeterminate :color="myColor" v-show="loading"></v-progress-linear>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Id</th>
              <th class="text-left">Nome</th>
              <th class="text-left">Preço</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in orders" :key="o.id" @click="show(o)">
              <td>{{ o.id }}</td>
              <td>{{ o.user.name }}</td>
              <td>{{ 'R$' + formatPrice(o.total)}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
    <v-col cols="4" :style="{background:''}">
      <v-card>
        <v-row justify="center">
          <v-col v-if="newCustomer" cols="10">
            <p class="text-center bold">Novo cliente</p>
            <p class="text-center bold">{{message}}</p>
            <v-text-field :disabled="isEditing" v-model="phone" label="Telefone" />
            <v-text-field v-model="name" label="Nome" />
            <v-text-field v-model="address" label="Endereço" />
            <v-select
              :items="locality"
              return-object
              item-text="name"
              item-value="rowId"
              v-model="locObj"
              label="Localidades"
            ></v-select>
            <a @click="cancelarForm">Cancelar</a>
          </v-col>
          <v-col v-else cols="10">
            <p class="text-center bold">Novo pedido</p>
            <v-text-field
              type="phone"
              counter="11"
              max-length="11"
              clearable
              v-model="phone"
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
              :disabled="filds"
            >Salvar</v-btn>
          </v-col>

          <v-col v-else cols="10">
            <v-btn
              :style="{background:myColor, color:'white'}"
              rounded
              @click="findCustomer"
              label="Preço"
              width="100%"
              :disabled="phone == ''"
            >Buscar</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <!-- </v-container> -->
</template>

<script>
import mixins from "../mixins/mixins";
import axios from "axios";
import { VMoney } from "v-money";
import sqlite3 from "sqlite3";

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

      newCustomer: false,

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
      isEditing:false,
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
    this.loadLocality();
    this.loadProducts();
  },

  computed: {
    filds() {
      return this.name == "" || this.phone == "" || this.address == "" || this.locObj == null;
    }
  },
  watch: {
    selected(e) {
      console.log(e);
    }
  },

  methods: {
    cancelarForm(){
      this.isEditing = false
      this.newCustomer = !this.newCustomer
      this.name = ""
      this.phone = ""
      this.address = ""
      this.locObj = {}
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    saveCustomer() {
      if (!this.userExists) {
        db.run(
          "INSERT INTO customers(name, phone, address, locality_id) VALUES(?, ?, ?, ?)",
          [this.name, this.phone, this.address, this.locObj.rowid],
          err => {
            if (err) {
              return console.log(err.message);
            }
            // get the last insert id
            console.log("Usuario salvo");
          }
        );
      } else {
        db.run(
          "UPDATE customers SET name = ?, phone = ?, address = ?, locality_id = ? where phone = '"+this.phone+"'",
          [this.name, this.phone, this.address, this.locObj.rowid],
          err => {
            if (err) {
              return console.log(err.message);
            }
            // get the last insert id
            console.log("Atualizado");
          }
        );
      }
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
      this.newCustomer = true
      await db.serialize(() => {
        db.each(
          'SELECT * FROM customers where phone="' + this.phone + '"',
          (err, row) => {
            if (err) {
              return console.error(err.message);
            }
            this.userExists = true;
            this.isEditing = true
            this.name = row.name;
            this.phone = row.phone;
            this.address = row.address;
            db.each(
              "select * from locality where rowid=" + row.locality_id,
              (err, row2) => {
                if (err) {
                  console.error(err.message);
                }

                if (!row2) {
                  return console.log("nenhum usuario encontrado");
                }
                this.locObj = row2;
              }
            );
          }
        );
      });
    }
  }
};
</script>
<style scoped>
  .inform{
    font-size: 12px;
    text-align: center;
    color: red;
  }
</style>
