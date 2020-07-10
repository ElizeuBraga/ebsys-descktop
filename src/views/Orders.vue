<template>
  <v-container fill-height fluid :style="{background:'', 'align-items': 'stretch'}">
    <v-row :style="{background:'', height:'93%'}">
      <v-col cols="5">
        <v-autocomplete
          ref="product"
          v-model="product"
          :items="items"
          :loading="isLoading"
          :color="color"
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
          :color="color"
          label="Quantidade"
          ref="quantity"
          v-model="quantity"
          type="number"
          min="1"
        />
      </v-col>

      <!-- coluna do Pedido -->

      <v-col cols="5" :style="{background:''}">
        <v-card height="100%" :style="{background: backgroundColor}" class="overflow-y-auto">
          <v-card-title class="justify-center">{{deliveryTitle}}</v-card-title>
          <u>
            <p
              v-if="delivery"
              align="center"
            >{{customer.name}} - {{customer.address}} - {{customer.phone}}</p>
          </u>
          <v-row class="pl-6 pr-6">
          <v-row class="pl-1 pr-1 text-center" v-for="(c, i) in cart" :key="i">
            <v-col cols="6" class="text-left pt-0 pb-0">{{c.name}}</v-col>
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
            <v-col cols="12" class="text-left pt-0 pb-0">
              <span :style="{'font-size':'12px'}" v-for="(o, i) in c.observations" :key="i">
                <span v-if="i > 0">,</span>
                {{o}}
              </span>
            </v-col>
            <v-col class="pt-0 pb-0 pr-0 pl-0" cols="12">
              <hr />
            </v-col>
          </v-row>
            
          </v-row>

          <v-card-actions
            :style="{'font-size': '20px', color:textColor, background:color, position:'absolute', bottom:0, width:'100%'}"
          >
            <v-col cols="6" class="text-center">Total</v-col>
            <v-col cols="6" class="text-center text-bold">R$ {{total.toFixed(2).replace('.', ',')}}</v-col>
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
              :color="color"
              hide-no-data
              hide-selected
              item-text="Description"
              item-value="API"
              placeholder="Selecione uma observação"
              prepend-icon="mdi-database-search"
              return-object
            ></v-autocomplete>
            <v-text-field
              :color="color"
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
                  :color="orderColor"
                  :disabled="updatingCustomer"
                  v-model="customer.phone"
                  label="Telefone"
                />
                <v-text-field
                  :color="orderColor"
                  :disabled="blockInputs"
                  v-model="customer.name"
                  label="Nome"
                />
                <v-text-field
                  :color="orderColor"
                  :disabled="blockInputs"
                  v-model="customer.address"
                  label="Endereço"
                />
                <v-select
                  :color="orderColor"
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
                  :color="orderColor"
                  v-model="customer.phone"
                  label="Telefone"
                />
              </v-col>
              <v-col v-if="newCustomer" cols="10">
                <v-btn
                  :style="{background:orderColor, color:'white'}"
                  rounded
                  @click="saveCustomer"
                  label="Preço"
                  width="100%"
                  :disabled="inputs"
                >Salvar</v-btn>
              </v-col>
              <v-col v-if="updatingCustomer" cols="10">
                <v-btn
                  :style="{background:color, color:'white'}"
                  rounded
                  @click="updateCustomer"
                  label="Preço"
                  width="100%"
                  :disabled="inputs"
                >Atualizar</v-btn>
              </v-col>
              <v-col v-if="findingCustomer" cols="10">
                <v-btn
                  :style="{background:color, color:'white'}"
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

      <!-- modal Receive-->
      <v-dialog v-model="dialogReceive" width="500" :persistent="false">
        <v-card>
          <v-card-title class="headline grey lighten-2 text-center" primary-title>{{formTitle}}</v-card-title>

          <v-card-text>
            <v-row justify="center">
              <v-text-field ref="receive" :color="color" v-model="total"></v-text-field>
              <v-autocomplete
                ref="typePayment"
                v-model="typePayment"
                :items="payments"
                :loading="isLoading"
                :color="color"
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
              :style="{width:'100%', background: color}"
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
    <v-footer :style="{background: color}" absolute class="font-weight-medium">
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
            <v-btn v-if="delivery" large :style="{color:'blue'}">Normal</v-btn>
            <!-- <v-btn
              :style="{color:'white'}"
              color="#0F8DB8"
              v-if="delivery"
              @click="typeOrderBalcao"
            >{{btnDesc}}</v-btn> -->
            <v-btn v-else large :style="{color:'blue'}">Normal</v-btn>
            <!-- <v-btn
              :style="{color:'white'}"
              color="#6B64EB"
              v-else
              @click="typeOrderDelivery"
            >{{btnDesc}}</v-btn> -->
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
      typePayment: {},
      paymentTypes: [
        { id: "M", name: "Dinheiro" },
        { id: "D", name: "Débito" },
        { id: "C", name: "Crédito" }
      ],
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
      dialogReceive: false,
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
    this.typeOrderBalcao()
    window.addEventListener("keypress", e => {
      if (e.keyCode == 13) {
        this.dialogObs = true;
      }
    });
    setTimeout(() => {
      this.$nextTick(() => {
        this.$refs.product.focus();
      }, 200);
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
      // this.obsSelected = true;
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

      this.insertInCart();

      this.dialogObs = false;
    },

    typeOrderDelivery() {
      this.findingCustomer = true;
      this.updatingCustomer = false;
      this.dialog = true;
      this.delivery = true;
      this.deliveryTitle = "Delivery";
      this.btnDesc = "Balcão";
      this.color = "red";

      this.$root.$emit("change_color", this.orderColor);
    },

    typeOrderBalcao() {
      this.customer = {};
      this.dialog = false;
      this.delivery = false;
      this.deliveryTitle = "Balcão";
      this.btnDesc = "Delivery";
      this.color = "orange";
      this.$root.$emit("change_color", this.color);
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
      console.log(this.locObj);
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

      this.total = 0;
      this.product = {};
      this.cart.forEach(element => {
        this.total += element.price * parseInt(element.quantity);
      });

      this.quantity = 0;
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
          this.blockInputs = true;
          console.log("Encontrei");
          this.updatingCustomer = true;
          this.findingCustomer = false;
          this.customer = row;
          let sql = "SELECT * FROM locality where id=?";
          db.get(sql, row.locality_id, (err, row) => {
            this.locObj = row;
          });
        } else {
          console.log("Não encontrei");
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
.inform {
  font-size: 12px;
  text-align: center;
  color: red;
}
</style>
