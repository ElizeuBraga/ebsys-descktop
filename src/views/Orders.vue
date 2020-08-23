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
          :hint="product.price ? quantity + ' X '+product.price.toFixed(2).replace('.', ',') + ' = ' + (quantity*product.price).toFixed(2).replace('.', ',') : ''"
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
          @focus="hasFocus"
          v-model="quantity"
          type="number"
          min="1"
        />
      </v-col>

      <!-- coluna do Pedido inicio-->
      <v-col cols="5" :style="{background:backgroundColor}">
        <v-card elevation="10" height="95%" :style="{background: ''}">
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
              <v-progress-circular
                v-if="value > 0"
                :rotate="180"
                :size="100"
                :width="15"
                :value="value"
                color="pink"
              >{{ value }}</v-progress-circular>

              <v-icon
                v-else
                :style="{opacity: 0.4}"
                :disabled="true"
                size="200"
                align="center"
              >shopping_cart</v-icon>
            </v-col>
          </v-row>
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
          <br />
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
                  >{{parseFloat(c.price * c.quantity).toFixed(2).replace('.', ',')}}</v-col>
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
                <span>{{c.observation}}</span>
              </v-col>
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

      <!-- observações -->
      <v-dialog v-model="dialogObs" width="500" :persistent="true">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Alguma Observação?</v-card-title>
          <v-card-text>
            <v-text-field
              :color="mainColor"
              ref="observation"
              v-model="observation"
              label="Observação"
            ></v-text-field>
            <v-switch v-model="donQuestionAgain" class="mx-2" label="Não mostrar novamente"></v-switch>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" ref="btnOkobs" text>Ok</v-btn>
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
          <v-card-title class="headline grey lighten-2 text-center" primary-title>Novo cliente</v-card-title>

          <v-card-text>
            <v-row justify="center">
              <v-col v-if="newCustomer || updatingCustomer" cols="10">
                <p class="text-center bold">Novo cliente</p>
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
          <v-card-title class="headline grey lighten-2 text-center" primary-title>Receber</v-card-title>

          <v-card-text>
            <v-row justify="center">
              <v-col cols="6">
                <v-text-field
                  :disabled="(totalToReceive == 0)"
                  ref="receive"
                  label="A receber"
                  :color="mainColor"
                  v-model="totalToReceive"
                ></v-text-field>
                <v-text-field
                  v-if="payment.name == 'Dinheiro'"
                  ref="amountMoney"
                  label="Quanto?"
                  :color="mainColor"
                  v-model="amountMoney"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  :disabled="(totalToReceive == 0)"
                  ref="payment"
                  v-model="payment"
                  :items="paymentsFormats"
                  :loading="isLoading"
                  :color="mainColor"
                  hide-no-data
                  hide-selected
                  item-text="name"
                  item-value="API"
                  label="Buscar um produto"
                  placeholder
                  prepend-icon="mdi-database-search"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <p v-for="(p, i) in payments" :key="i">
                  <b>{{p.payment.name}}:</b>
                  <span v-if="p.payment.name == 'Dinheiro'">
                    {{parseFloat(p.payment.amountMoney).toFixed(2).replace('.', ',')}} - {{parseFloat(p.totalForThispayment).toFixed(2).replace('.', ',')}}
                    <b>Troco</b>
                    {{parseFloat(parseFloat(p.payment.amountMoney) - parseFloat(p.totalForThispayment)).toFixed(2).replace('.', ',')}}
                  </span>
                  <span v-else>{{parseFloat(p.totalForThispayment).toFixed(2).replace('.', ',')}}</span>
                </p>
              </v-col>
              <div>
                <!-- <span
                  cols="4"
                  v-for="(p, i) in payments"
                  :key="i"
                >{{p.name}} - {{p.price.toFixed(2).replace('.', ',')}}</span>-->
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
                  ref="password"
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
          </v-col>
          <v-col align="center" cols="4">
            <span
              :style="{color: mainColor}"
              v-if="userCashier"
            >Caixa aberto por {{userCashier.name}}</span>
            <span :style="{color: 'red'}" v-else>Caixa fechado</span>
          </v-col>
          <v-col align="center" cols="4">
            <v-btn v-if="delivery" large :style="{color:'blue'}" @click="typeOrderBalcao">Balcão</v-btn>
            <v-btn v-else large :style="{color:'blue'}" @click="typeOrderDelivery">Entregas</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-footer>
  </v-container>
</template>

<script src="https://js.pusher.com/7.0/pusher.min.js"></script>
<script>
import mixins from "../mixins/mixins";
import axios from "axios";
import { VMoney } from "v-money";
import sqlite3 from "sqlite3";
import { Product } from "../models/Product";
import { ProductController } from "../controllers/ProductController";
import { LocalityController } from "../controllers/LocalityController";
import { OrderController } from "../controllers/OrderController";
import { ItemController } from "../controllers/ItemController";
import { CashierController } from "../controllers/CashierController";
import { PaymentController } from "../controllers/PaymentController";
import { CustomerController } from "../controllers/CustomerController";
import { UserController } from "../controllers/UserController";
import bcryptjs from "bcryptjs";
import { Cashier } from "../models/Cashier";

const db = new sqlite3.Database(
  "/home/basis/Downloads/app-descktop/src/database/database.db"
);

var pusher = new Pusher("a885cc143df63df6146a", {
  cluster: "us2",
});

export default {
  mixins: [mixins],
  directives: { money: VMoney },
  data() {
    return {
      money: {
        decimal: ",",
        thousands: ".",
        precision: 2,
        masked: false, // doesn't work with directive
        // Waiting on https://github.com/vuejs-tips/v-money/pull/51 to be merged
        allowBlank: true,
      },

      //cashier variables
      statusCashier: false,
      total: 0,
      totalToReceive: 0,
      cashier: {
        debit: "0,00",
        credit: "0,00",
        ticket: "0,00",
        money: "0,00",
      },
      modalCloseCashier: false,
      userCashier: undefined,

      //payment variables
      payment: {},
      payments: [],
      paymentsFormats: [
        { id: 1, name: "Dinheiro" },
        { id: 2, name: "Débito" },
        { id: 3, name: "Crédito" },
        { id: 4, name: "Ticket" },
      ],
      dialogReceive: false,
      amountMoney: 0.0,
      //user variables
      username: "",
      password: "",
      confirm_password: "",
      dialog: false,
      unlogged: true,
      resetpassword: false,

      //messages variable
      error: false,
      success: false,
      msg: "",
      msgloginerror: "",
      msgLogin: false,

      //order variables
      interval: {},
      value: 0,
      hasFocusQuantity: true,
      order: {},
      locObj: {},
      locality: [],
      product: {},
      products: [],
      cart: [],
      quantity: 1,
      deliveryTitle: "Balcão",
      delivery: false,
      fluxEnter: "quantity",
      donQuestionAgain: false,

      // obs variables
      observation: "",
      observations: [
        { name: "Suco", rowid: 1 },
        { name: "Coca", rowid: 2 },
      ],
      dialogObs: false,
      descriptionLimit: 60,

      // customer variables
      customer: {},
      dialogCustomer: false,
      btnDesc: "Delivery",
      newCustomer: false,
      updatingCustomer: false,
      dialog: false,
      modalFindCustomer: false,
      modalCustomer: false,

      isLoading: false,
      blockInputs: false,
    };
  },

  async mounted() {
    var channel = pusher.subscribe("my-channel");
    channel.bind("App\\Events\\ProductEvent", (data) => {
      this.updateProducts()
    });
    this.checkUserOpenedCashier();
    this.typeOrderBalcao();

    this.$root.$on("logout", (e) => {
      this.unlogged = e;
      this.password = "";
    });

    this.$root.$on("update_products", async (e) => {
      this.updateProducts();
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
    document.onkeydown = (e) => {
      if (e.key == "Enter" && this.username && this.password) {
        this.login(this.username, this.password);
      }
      if (e.key == "F5") {
        if (this.delivery) {
          this.typeOrderBalcao();
        } else {
          this.typeOrderDelivery();
        }
      }

      if (e.key == "F1" && !this.unlogged) {
        if (!this.statusCashier) {
          this.showMessageError("Caixa fechado");
          return;
        } else if (this.cart.length == 0) {
          this.showMessageError("Sem itens para pedido");
          return;
        }
        setTimeout(() => {
          this.$refs.receive.focus();
          // this.$refs.receive.select();
        }, 200);
        this.totalToReceive = this.total;
        this.dialogReceive = true;
      }

      if (e.keyCode == 27 && !this.dialogObs) {
        this.product = {};
        this.quantity = 1;

        this.$nextTick(() => {
          const input = this.$refs.product.$el.querySelector("input");
          input.focus();
        });
      }

      if (e.keyCode == 13) {
        if (this.dialogReceive) {
          this.$refs.payment.focus();
        }

        if (Object.keys(this.payment).length > 0) {
          if (this.payment.name == "Dinheiro") {
            this.$refs.amountMoney.focus();
          }
          if (
            parseFloat(this.amountMoney) > 0 &&
            parseFloat(this.amountMoney) > parseFloat(this.totalToReceive)
          ) {
            this.payment.amountMoney = this.amountMoney;
            this.payments.push({
              total: this.total,
              totalForThispayment: this.totalToReceive,
              payment: JSON.parse(JSON.stringify(this.payment)),
            });
            let payment = new PaymentController();
            let result = payment.calcPayment(this.payments);
            this.payment = {};
            this.totalToReceive = parseFloat(result).toFixed(2);
          }
        }
        if (
          Object.keys(this.product).length > 0 &&
          this.fluxEnter == "quantity"
        ) {
          this.$refs.quantity.focus();
          this.setFluxEnter("obs");
        }

        if (this.fluxEnter == "obs") {
          if (this.product.ask_obs == 1) {
            setTimeout(() => {
              this.$nextTick(() => {
                this.$refs.observation.focus();
                this.setFluxEnter("product");
              });
            }, 200);
            this.dialogObs = true;
          } else {
            this.$nextTick(() => {
              const input = this.$refs.product.$el.querySelector("input");
              input.focus();
            });
            this.insertInCart(this.product);
          }
        }

        if (this.fluxEnter == "product") {
          this.dialogObs = false;
          this.insertInCart(this.product);
          this.setFluxEnter("quantity");

          this.$nextTick(() => {
            const input = this.$refs.product.$el.querySelector("input");
            input.focus();
          });
        }

        // if (e.keyCode == 13 && Object.keys(this.payment).length > 0) {
        //   let payment = new PaymentController();
        //   let result = payment.calcPayment(
        //     parseFloat(this.totalToReceive),
        //     this.payment
        //   );
        //   this.payments.push(JSON.parse(JSON.stringify(result)));

        //   let calcResult = 0;
        //   this.payments.forEach(element => {
        //     calcResult += element.price;
        //   });

        //   this.totalToReceive = this.total - calcResult;
        //   this.payment = {};
        //   if (this.totalToReceive == 0) {
        //     this.$refs.btnendorder.$el.focus();
        //   }
        // }
      }
      // if (e.keyCode == 13 && this.dialogReceive) {
      //   this.$refs.payment.focus();
      // }

      // if (e.keyCode == 13 && this.dialogReceive && this.totalToReceive == 0) {
      //   this.endOrder(this.order, this.cart);
      // }

      // if (e.keyCode == 13 && Object.keys(this.product).length > 0) {
      //   if (!this.cashier.created_at) {
      //     // this.$refs.quantity.focus();
      //     this.showMessageError("Caixa fechado");
      //     this.product = {};
      //     return;
      //   }
      //   this.$refs.quantity.focus();
      // }

      // if (e.keyCode == 13 && Object.keys(this.payment).length > 0) {
      //   let payment = new PaymentController();
      //   let result = payment.calcPayment(
      //     parseFloat(this.totalToReceive),
      //     this.payment
      //   );
      //   this.payments.push(JSON.parse(JSON.stringify(result)));

      //   let calcResult = 0;
      //   this.payments.forEach(element => {
      //     calcResult += element.price;
      //   });

      //   this.totalToReceive = this.total - calcResult;
      //   this.payment = {};
      //   if (this.totalToReceive == 0) {
      //     this.$refs.btnendorder.$el.focus();
      //   }
      // }

      // if (e.keyCode == 116 && !this.unlogged) {
      //   if (this.delivery) {
      //     this.typeOrderBalcao();
      //     setTimeout(() => {
      //       this.$refs.product.focus();
      //     }, 200);
      //   } else {
      //     this.typeOrderDelivery();
      //     setTimeout(() => {
      //       this.$refs.phone.focus();
      //     }, 200);
      //   }
      // }

      // if (e.keyCode === 112) {
      //   if (
      //     this.cart.length == 0 ||
      //     localStorage.getItem("cashier_id") == "null"
      //   ) {
      //     if (localStorage.getItem("cashier_id") == "null") {
      //       this.showMessageError("Caixa fechado");
      //     } else {
      //       this.showMessageError("Sem itens para pedido");
      //     }

      //     return;
      //   }
      //   setTimeout(() => {
      //     this.$refs.receive.focus();
      //   }, 200);
      //   this.totalToReceive = this.total;
      //   this.dialogReceive = true;
      // }

      // if (e.keyCode == 13) {
      //   if (this.observationSecond != "") {
      //     // this.dialogObs = true;
      //     this.saveObs();
      //   }
      //   if (this.quantity >= 1 && Object.keys(this.product).length > 0 && !this.hasFocusQuantity) {
      //     this.dialogObs = true;
      //     setTimeout(() => {
      //       this.$nextTick(() => {
      //         this.$refs.observation.focus();
      //       });
      //     }, 200);
      //   }
      // }
    };
  },

  computed: {
    // flux of the key enter
    computProductForQuantity() {
      return this.product != Object.keys(this.product).length > 0;
    },

    fieldsLogin() {
      return this.username == "" || this.password == "";
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
      return this.products.map((product) => {
        const Description =
          product.name.length > this.descriptionLimit
            ? product.name.slice(0, this.descriptionLimit) + "..."
            : product.name;
        return Object.assign({}, product, { Description });
      });
    },

    obs() {
      return this.observations.map((obs) => {
        const Description =
          obs.name.length > this.descriptionLimit
            ? obs.name.slice(0, this.descriptionLimit) + "..."
            : obs.name;

        return Object.assign({}, obs, { Description });
      });
    },
  },

  watch: {
    donQuestionAgain(e) {
      console.log(e);
    },
    product() {
      this.fluxEnter = "quantity";
      this.quantity = 1;
    },

    payment(e) {
      if (e.name != "Dinheiro") {
        this.amountMoney = 1.0;
      } else {
        this.amountMoney = 0.0;
      }

      console.log(this.amountMoney);
    },
  },

  methods: {
    async updateProducts(){
      await axios
        .get(
          "https://api-api-api-api.herokuapp.com/api/for_sincronize/products"
        )
        .then(async (response) => {
          let product = new Product();
          await product.update(response.data);
        });

      let p = new ProductController();
      this.products = await p.index();
      this.showMessageSucess("Produtos atualizados com sucesso!");
    },

    setFluxEnter(val) {
      setTimeout(() => {
        this.fluxEnter = val;
      }, 300);
    },
    async checkUserOpenedCashier() {
      let cashier = new Cashier();
      let response = await cashier.checkUserOpenedCashier();
      this.userCashier = response;
    },

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
      if (password != confirm_password) {
        this.showMessageErrorLogin("Senhas não conferem");
        return;
      }
      let u = {
        password: password,
        id: this.loggedUser.id,
      };
      let user = new UserController();
      user.update(u);
      this.resetpassword = false;
      this.showMessageSucess("Senha alterada com sucesso");
    },

    async login(username, password) {
      let user = new UserController();
      let result = await user.login(username, password);

      if (!result) {
        this.showMessageErrorLogin("Usuario e/ou senha estão incorretos");
        return;
      }

      bcryptjs.compare(password, result.password, (err, res) => {
        if (res === true) {
          if (result.updated_at === null) {
            this.resetpassword = true;
          }
          if (
            result.id != this.userCashier.id &&
            this.userCashier.id != undefined
          ) {
            this.showMessageErrorLogin(
              "Este caixa foi aberto por outro usuario, contate o administrador."
            );
          } else {
            this.loggedUser = result;
            this.unlogged = false;
            this.username = "";
            this.password = "";
            this.$root.$emit("logged_user", result);
            this.$nextTick(() => {
              const input = this.$refs.product.$el.querySelector("input");
              input.focus();
            });
          }
        } else {
          this.showMessageErrorLogin("Usuario e/ou senha estão incorretos");
        }
      });
    },

    openCashier(loggedUser) {
      let cashier = new CashierController();
      cashier.store(loggedUser);
      this.cashierStatus();
      this.checkUserOpenedCashier();
    },

    closeCashier(c) {
      let cashier = new CashierController();
      cashier.update(c);
      if (this.cashierStatus()) {
        this.showMessageSucess("Caixa fechado com sucesso");
      }

      this.checkUserOpenedCashier();
      this.modalCloseCashier = false;
    },

    removeFromCart(i, parcialPrice) {
      this.total = this.total - parcialPrice;
      this.cart.splice(i, 1);
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
      this.amountMoney = 0;
      this.payments = [];
      this.typeOrderBalcao();
    },

    typeOrderDelivery() {
      this.delivery = true;
      this.deliveryTitle = "Entregas";
      this.btnDesc = "Balcão";
      this.cart = [];
      this.total = 0;
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
          this.customer.phone,
        ],
        (err) => {
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

    hasFocus() {
      setTimeout(() => {
        this.hasFocusQuantity = false;
      }, 300);
    },

    insertInCart(product) {
      if (this.donQuestionAgain) {
        let p = new Product();
        p.dontAskAgain(product.id);
      }
      product.observation = this.observation;
      product.quantity = this.quantity;
      let prod = JSON.stringify(product);
      this.cart.push(JSON.parse(prod));

      this.total = 0;
      this.product = {};
      this.cart.forEach((element) => {
        this.total += element.price * parseInt(element.quantity);
      });

      this.quantity = 1;
      this.observation = "";
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
    },
  },
};
</script>
<style scoped>
</style>
