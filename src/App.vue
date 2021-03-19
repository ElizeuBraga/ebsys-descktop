<template>
  <div style="min-height: 100vh; background-color: #dee2e6">
    <b-tabs v-model="tabIndex" card>
      <!--
        *
        *
        * Tab countertop
      -->
      <b-tab
        title="Balcão"
        @click="changeTab(0)"
        :title-link-class="linkClass(0)"
      >
        <order-component :orderType="0" />
      </b-tab>

      <!--
        *
        *
        * Tab deliveries
        -->
      <b-tab
        title="Entregas"
        @click="changeTab(1)"
        :title-link-class="linkClass(1)"
      >
        <order-component :orderType="1" />
      </b-tab>

      <!--
        *
        *
        * Tab cashiers
        -->
      <b-tab
        title="Meus caixas"
        @click="changeTab(2)"
        :title-link-class="linkClass(2)"
      >
        <cashier-component />
      </b-tab>
    </b-tabs>

    <!--
      *
      *
      * Footer component
    -->
    <footer-component />
  </div>
</template>
<style>
.card-header {
  border-radius: 0 !important;
  border: #2778c4 !important;
  background-color: #2778c4 !important;
}

.nav-link.active.bg-primary.text-light {
  color: #2778c4 !important;
  border-color: rgb(222, 226, 230) !important;
  background-color: rgb(222, 226, 230) !important;
}

.nav-link.bg-light.text-info {
  border-radius: 0 !important;
  color: white !important;
  border: #2778c4 !important;
  background-color: #2778c4 !important;
}

.swal2-input,
.swal2-input:focus {
  background-color: white;
  border: 2px solid #2778c4;
}
#input-product0,
#input-product1,
#input-qtd0,
#input-qtd1 {
  margin: 0 !important;
}

.swal2-title {
  color: #2778c4;
}

.footer {
  left: 0;
  bottom: 0;
  width: 100%;
  color: white;
  position: fixed;
  padding-top: 5px;
  text-align: center;
  background: #2778c4;
}
</style>
<script>
import Vue from "vue";
import Swal from "sweetalert2";
import { DB } from "./models/DB";
import { Ws } from "./models/Ws";
const Pusher = require("pusher-js");
import { City } from "./models/City";
import { Item } from "./models/Item";
import mixins from "./mixins/mixins";
import { User } from "./models/User";
import EventBus from "../src/EventBus";
import { Order } from "./models/Order";
import { Helper } from "./models/Helper";
import "bootstrap/dist/css/bootstrap.css";
import { Product } from "./models/Product";
import { Payment } from "./models/Payment";
import { Cashier } from "./models/Cashier";
import { Customer } from "./models/Customer";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { PaymentOrder } from "./models/PaymentOrder";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import OrderComponent from "./components/OrderComponent.vue";
import CashierComponent from "./components/CashierComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

const db = new DB();
const ws = new Ws();
const item = new Item();
const city = new City();
const user = new User();
const order = new Order();
const helper = new Helper();
const cashier = new Cashier();
const product = new Product();
const payment = new Payment();
const customer = new Customer();
const paymentOrder = new PaymentOrder();

var pusher = new Pusher("a885cc143df63df6146a", {
  cluster: "us2",
});

var channel = pusher.subscribe("data-insert");
var channel2 = pusher.subscribe("data-update");

export default {
  mixins: [mixins],
  components: {
    OrderComponent,
    FooterComponent,
    CashierComponent,
  },
  data() {
    return {
      tab: 0,
      cart: [],
      search: "",
      order: {},
      custom: [],
      cities: [],
      cashiers: [],
      event_aux: 0,
      products: [],
      paymentInfo: [],
      cashierIsOpen: false,
      paymentInfoCashier: [],
    };
  },
  async mounted() {
    this.updateData();
    this.initLoginProccess();

    channel.bind("insert", async (data) => {
      await new Ws().downloadDataFromServer("insert");
    });

    channel2.bind("update", async (data) => {
      await new Ws().downloadDataFromServer("update");
    });

    this.paymentsFormats = await payment.all();

    EventBus.$on("amount-computed", (e) => {
      this.totalCart = e;
    });

    EventBus.$on("amount-computed-items", (e) => {
      this.totalItems = e[0];
      this.paymentInfoCashier = e[1];
    });

    EventBus.$on("cashier-closed", async (e) => {
      this.cashierIsOpen = await cashier.isOpen();
    });

    EventBus.$on("cashier-opened", async (e) => {
      this.$nextTick(async () => {
        this.cashierIsOpen = await cashier.isOpen();
      });
    });

    this.cashierIsOpen = await cashier.isOpen();
  },
  methods: {
    async updateData() {
      await new Ws().downloadDataFromServer("insert");
      await new Ws().downloadDataFromServer("update");
    },

    changeTab(tabIndex) {
      EventBus.$emit("change-tab", tabIndex);
      this.tab = tabIndex;
    },

    async initLoginProccess() {
      let html =
        '<input id="swal-input1" placeholder="Dinheiro" class="swal2-input">';
      html +=
        '<input id="swal-input2" type="password" placeholder="Senha" class="swal2-input">';
      html +=
        '<input id="swal-input3" name="swal-input3" value="Sim" type="checkbox" style="padding: 35px;">';
      html += '<label for="swal-input3">Lembrar meu email/telefone</label>';
      Swal.fire({
        title: "Login",
        html: html,
        allowOutsideClick: false,
        confirmButtonText: "Entrar",
        didOpen: () => {
          let inputEmail = document.getElementById("swal-input1");
          inputEmail.value = localStorage.getItem("email_phone");

          // remove later
          let inputPass = document.getElementById("swal-input2");

          inputPass.value = localStorage.getItem("password");

          setTimeout(() => {
            if (inputPass.value !== "" && inputEmail.value !== "") {
              document.querySelector(".swal2-confirm").focus();
            }
          }, 200);
          if (localStorage.getItem("email_phone")) {
            let value3 = (document.getElementById(
              "swal-input3"
            ).checked = true);
          }
        },
        preConfirm: () => {
          let value1 = document.getElementById("swal-input1").value;
          let value2 = document.getElementById("swal-input2").value;
          let value3 = document.getElementById("swal-input3");
          if (value1 == "") {
            Swal.showValidationMessage("Digite seu email/telefone");
          } else if (value2 == "") {
            Swal.showValidationMessage("Digite sua senha");
          }
          return [value1, value2, value3.checked];
        },
      }).then(async (result) => {
        let auth = await user.auth(result.value[0], result.value[1]);
        if (!auth) {
          Swal.showValidationMessage("Email e/ou senha estão incorretos!");
          this.initLoginProccess();
        }

        if (result.value[2]) {
          localStorage.setItem("email_phone", result.value[0]);

          // remove later
          localStorage.setItem("password", result.value[1]);

          document.getElementById("input-product0").focus();
        } else {
          localStorage.removeItem("password");
        }
      });
    },

    async isOpen() {
      this.cashierIsOpen = await cashier.isOpen();
    },

    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ["bg-primary", "text-light"];
      } else {
        return ["bg-light", "text-info"];
      }
    },
  },

  computed: {

  },
  
  watch: {

  },
};
</script>
<style lang="scss">
.font-big {
  font-size: 25px;
}
</style>
