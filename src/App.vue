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
        :title-link-class="linkClass(0)"
        @click="changeTab(0)"
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
        :title-link-class="linkClass(1)"
        @click="changeTab(1)"
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
        :title-link-class="linkClass(2)"
        @click="changeTab(2)"
      >
        <cashier-component/>
      </b-tab>
    </b-tabs>

    <footer class="footer">
      <div class="row">
        <div class="col-6"></div>
        <div class="col-6">
          <b-row>
            <b-col class="font-big"> Total </b-col>
            <b-col class="font-big"> R$ {{ formatMoney(totalCart) }} </b-col>
          </b-row>
        </div>
      </div>
    </footer>
  </div>
</template>
<style>
.table-responsive {
  /* max-height: 800px; */
  /* min-height: 800px; */
}

/* table tbody {
  display: block;
  overflow-y: scroll;
} */

.card-header {
  background-color: #2778c4 !important;
  border-radius: 0 !important;
  border: #2778c4 !important;
}

.nav.nav-tabs.card-header-tabs {
  /* margin: 0!important; */
}

.nav-link.active.bg-primary.text-light {
  background-color: rgb(222, 226, 230) !important;
  color: #2778c4 !important;
  border-color: rgb(222, 226, 230) !important;
}

.nav-link.bg-light.text-info {
  border-radius: 0 !important;
  background-color: #2778c4 !important;
  color: white !important;
  border: #2778c4 !important;
}

.swal2-input, .swal2-input:focus{
  border: 2px solid #2778c4;
  background-color: white;
}
#input-product0, #input-product1, #input-qtd0, #input-qtd1{
  margin: 0!important;
}

.swal2-title{
  color: #2778c4;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  color: white;
  /* margin-bottom: 5px; */
  padding-top: 5px;
  width: 100%;
  background: #2778c4;
  text-align: center;
}
</style>
<script>
import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { Product } from "./models/Product";
import { DB } from "./models/DB";
import { Ws } from "./models/Ws";
import { User } from "./models/User";
import { Cashier } from "./models/Cashier";
import { City } from "./models/City";
import { Helper } from "./models/Helper";
import { Customer } from "./models/Customer";
import { Payment } from "./models/Payment";
import { Order } from "./models/Order";
import { Item } from "./models/Item";
import { PaymentOrder } from "./models/PaymentOrder";
import EventBus from "../src/EventBus";
const Pusher = require("pusher-js");
// import { mixins } from "./mixins/mixins";
import Swal from "sweetalert2";
import OrderComponent from "./components/OrderComponent.vue";
import CashierComponent from "./components/CashierComponent.vue";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// const db = new DB().createDatabase();
const product = new Product();
const helper = new Helper();
const city = new City();
const customer = new Customer();
const db = new DB();
const ws = new Ws();
const user = new User();
const cashier = new Cashier();
const payment = new Payment();
const order = new Order();
const item = new Item();
const paymentOrder = new PaymentOrder();

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;

var pusher = new Pusher("a885cc143df63df6146a", {
  cluster: "us2",
});

var channel = pusher.subscribe("data-insert");
var channel2 = pusher.subscribe("data-update");

export default {
  // mixins:[mixins],
  components: {
    OrderComponent,
    CashierComponent
  },
  data() {
    return {
      bluePrimary: "#2778c4",
      event_aux: 0,
      paymentInfo: [],
      receiving: false,
      tabIndex: 0,
      tab: 0,
      products: [],
      cities: [],
      cart: [],
      totalCart: 0,
      search: "",
      cashierIsOpen: false,
      paymentsFormats: [],
      cashiers: [],
      order: {},
      custom: [],
    };
  },
  async mounted() {
    this.initLoginProccess();

    channel.bind("insert", async (data) => {
      await new Ws().downloadDataFromServer("insert");
      console.log('Insert');
      // this.updateData();
    });

    channel2.bind("update", async (data) => {
      console.log('Update');
      await new Ws().downloadDataFromServer("update");
      // this.updateData();
    });

    // console.log()
    this.paymentsFormats = await payment.all();

    EventBus.$on("amount-computed", (e) => {
      this.totalCart = e;
    });

    this.getCashiers();
    await this.isOpen();
    // this.localities = await locality.all();
    // await ws.loadAll();
  },
  methods: {
    async updateData() {
      await new Ws().downloadDataFromServer("insert");
      await new Ws().downloadDataFromServer("update");
    },

    formatMoney(value) {
      return helper.formatMoney(value);
    },

    changeTab(tabIndex) {
      EventBus.$emit("change-tab", tabIndex);
      this.tab = tabIndex;
    },

    async cashierInfo(cashier_id) {
      let items = await cashier.getCashierInfo(cashier_id);
      let html = "";
      if (items.length == 0) {
        html +=
          "<tr><span class='text-danger'>Nehnum item encontrado</span><tr>";
      } else {
        html = `
            <table class="table  table-striped">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th class="text-center" scope="col">Quantidade</th>
                  <th class="text-center" scope="col">Total</th>
                </tr>
              </thead>
              <tbody>`;

        items.forEach((i) => {
          html += `<tr>
                          <th>${i.name}</th>
                          <td class="text-center">${i.quantity}</td>
                          <td class="text-center">${parseFloat(i.total)
                            .toFixed(2)
                            .replace(".", ",")}</td>
                        </tr>`;
        });

        html += `</tbody>
            </table>`;
      }
      Swal.fire({
        title: "Informações",
        html: html,
        showCloseButton: true,
      });
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

    async openCashier() {
      await cashier.create();

      setTimeout(async () => {
        await this.isOpen();
      }, 1000);
    },

    closeCashier() {
      var keepOpen = true;
      let amounts = [];
      let html =
        '<select id="swal2-select" class="swal2-select" name=""><option selected value disabled>Selecione</option>';
      this.paymentsFormats.forEach((element) => {
        html +=
          '<option value="' + element.id + '">' + element.name + "</option>";
      });
      html += "</select>";
      html +=
        '<input id="swal-input1" placeholder="Valor" class="swal2-input">';
      Swal.fire({
        title: "Fechamento",
        html: html,
        allowOutsideClick: false,
        confirmButtonText: "Inserir",
        denyButtonText: "Fechar o caixa",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        showDenyButton: true,
        didOpen: () => {
          let btnConfirm = document.querySelector(".swal2-confirm");

          btnConfirm.addEventListener("click", () => {
            keepOpen = true;
          });
          //  Swal.disableButtons()
        },
        preConfirm: () => {
          let payment_id = document.getElementById("swal2-select").value;
          let price = document.getElementById("swal-input1").value;

          return { payment_id: payment_id, price: parseFloat(price) };
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.paymentInfo.push(result.value);
          this.closeCashier();
        } else if (result.isDismissed) {
          this.paymentInfo = [];
        } else {
          // this.paymentInfo = []
          Swal.fire({
            icon: "question",
            title: "Finalizar recebimento?",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isDismissed) {
              this.closeCashier();
            } else if (result.isConfirmed) {
              cashier.update(this.paymentInfo);

              this.paymentInfo = [];
            }
          });
        }
      });
    },

    async isOpen() {
      this.cashierIsOpen = await cashier.isOpen();
    },

    async login() {
      let auth = await user.auth();
      if (!auth) {
      }
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
    infoForBtnReceive() {
      if (!this.cashierIsOpen) {
        return "Caixa fechado";
      }
      if (this.cart == 0) {
        return "Pedido vazio";
      }
    },

    receiveDisabled() {
      return this.cart.length == 0;
    },
  },
  watch: {
    async search(e) {
      this.products = await product.selectProdutcToCart(e);
      var opts = document.getElementById("producs").childNodes;
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === e) {
          let inputQtd = document.getElementById("input-qtd");

          if (this.tab === 1) {
            inputQtd = document.getElementById("input-qtd-delivery");
          }

          inputQtd.focus();
          break;
        }
      }
    },
  },
};
</script>
<style lang="scss">
.font-big {
  font-size: 30px;
}
</style>
