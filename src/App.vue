<template>
  <div style="min-height: 100vh">
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
        <b-row>
          <b-row class="w-50 p-3 mh-100">
            <b-col cols="10">
              <b-form-input
                v-model="search"
                list="producs"
                id="input-product"
              ></b-form-input>
              <datalist id="producs">
                <option
                  v-for="(p, index) in products"
                  :value="p.name"
                  :key="index"
                >
                  {{ parseFloat(p.price).toFixed(2).replace(".", ",") }}
                </option>
              </datalist>
            </b-col>
            <b-col cols="2">
              <b-form-input
                type="number"
                min="1"
                value="1"
                id="input-qtd"
              ></b-form-input>
            </b-col>
          </b-row>
          <b-row class="w-50 p-3">
            <b-col>
              <table class="table table-striped table-responsive">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Produto</th>
                    <th class="text-center" scope="col">Valor</th>
                    <th class="text-center" scope="col">Quantidade</th>
                    <th class="text-center" scope="col">Valor parcial</th>
                    <th class="text-center" scope="col">Opções</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i, index) in cart" :key="index">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ i.name }}</td>
                    <td class="text-center">
                      {{ parseFloat(i.price).toFixed(2).replace(".", ",") }}
                    </td>
                    <td class="text-center">{{ i.qtd }}</td>
                    <td class="text-center">
                      {{
                        parseFloat(i.qtd * i.price)
                          .toFixed(2)
                          .replace(".", ",")
                      }}
                    </td>
                    <td class="text-center">
                      <b-icon
                        style="cursor: pointer"
                        @click="removeItem(index)"
                        variant="danger"
                        icon="trash-fill"
                        aria-hidden="true"
                      ></b-icon>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="row" style="background: red">
                <div class="col-4"></div>
                <div class="col-4"></div>
                <div class="col-4">
                  R$ {{ formatMoney(computedOrderAmount) }}
                </div>
              </div>
            </b-col>
          </b-row>
        </b-row>
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
        <b-row>
          <b-row class="w-50 p-3 mh-100">
            <b-col cols="10">
              <b-form-input
                id="input-product-delivery"
                v-model="search"
                list="producs"
              ></b-form-input>
              <datalist id="producs">
                <option v-for="(p, i) in products" :value="p.name" :key="i">
                  {{ parseFloat(p.price).toFixed(2).replace(".", ",") }}
                </option>
              </datalist>
            </b-col>
            <b-col cols="2">
              <b-form-input
                type="number"
                min="1"
                value="1"
                id="input-qtd-delivery"
              ></b-form-input>
            </b-col>
          </b-row>
          <b-row class="w-50 p-3">
            <b-col>
              <div v-if="custom.length > 0" class="text-center">
                <span>{{ custom[0].name }} - {{ custom[0].phone }}</span
                ><br />
                <span>{{ custom[0].address }} - {{ custom[0].locality }}</span>
              </div>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Produto</th>
                    <th class="text-center" scope="col">Valor</th>
                    <th class="text-center" scope="col">Quantidade</th>
                    <th class="text-center" scope="col">Valor parcial</th>
                    <th class="text-center" scope="col">Opções</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i, index) in cart" :key="index">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ i.name }}</td>
                    <td class="text-center">
                      {{ parseFloat(i.price).toFixed(2).replace(".", ",") }}
                    </td>
                    <td class="text-center">{{ i.qtd }}</td>
                    <td class="text-center">
                      {{
                        parseFloat(i.qtd * i.price)
                          .toFixed(2)
                          .replace(".", ",")
                      }}
                    </td>
                    <td class="text-center">
                      <b-icon
                        style="cursor: pointer"
                        @click="removeItem(index)"
                        variant="danger"
                        icon="trash-fill"
                        aria-hidden="true"
                      ></b-icon>
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-col>
          </b-row>
        </b-row>
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
        <b-row v-if="cashierIsOpen">
          <b-col cols="8" class="text-success"> Caixa aberto </b-col>
          <b-col cols="4" class="text-right">
            <button
              class="btn btn-primary m-2"
              @click="getCashiers((byDate = true))"
            >
              Buscar
            </button>
            <button class="btn btn-danger" @click="closeCashier">
              Fechar caixa
            </button>
          </b-col>
        </b-row>
        <b-row v-if="!cashierIsOpen">
          <b-col cols="8" class="text-danger"> Caixa fechado </b-col>
          <b-col cols="4" class="text-right">
            <button
              class="btn btn-primary m-2"
              @click="getCashiers((byDate = true))"
            >
              Buscar
            </button>
            <button class="btn btn-success" @click="openCashier">
              Abrir caixa
            </button>
          </b-col>
        </b-row>

        <table class="table table-hover">
          <thead>
            <tr>
              <th class="text-center" scope="col">Data</th>
              <th class="text-center" scope="col">Valor</th>
              <th class="text-center" scope="col">Fechado por</th>
              <th class="text-center" scope="col">Data fechamento</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-center text-danger" v-if="cashiers.length == 0">
              <th></th>
              <th></th>
              <th>Nenhum registro encontrado</th>
              <th></th>
            </tr>
            <tr
              v-else
              style="cursor: pointer"
              title="Clique para mais informações"
              v-for="(c, index) in cashiers"
              :key="index"
              @click="cashierInfo(c.id)"
            >
              <th class="text-center" scope="row">{{ c.created_at }}</th>
              <td class="text-center">
                {{ parseFloat(c.value).toFixed(2).replace(".", ",") }}
              </td>
              <td class="text-center">{{ c.user_name }}</td>
              <td class="text-center">{{ c.updated_at }}</td>
            </tr>
          </tbody>
        </table>
      </b-tab>
    </b-tabs>

    <footer class="footer">
      <div class="row">
        <div class="col-4">
          <!-- <button class="btn btn-primary">Abrir caixa</button> -->
        </div>
        <div class="col-4">
          <!-- <button class="btn btn-primary">Receber pedido</button> -->
        </div>
        <div class="col-4">
          <button
            v-if="tab == 0"
            class="btn btn-primary"
            :title="infoForBtnReceive"
            @click="closeOrder"
            :disabled="receiveDisabled"
          >
            Encerrar pedido (F9)
          </button>
          <button
            v-if="tab == 1"
            class="btn btn-primary"
            :title="infoForBtnReceive"
            @click="closeOrder"
            :disabled="receiveDisabled"
          >
            Encerrar delivery
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>
<style>
.table-responsive {
  max-height: 800px;
  min-height: 800px;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  margin-bottom: 5px;
  padding-top: 5px;
  width: 100%;
  background: rgba(0, 0, 0, 0.03);
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
import { Locality } from "./models/Locality";
import { Helper } from "./models/Helper";
import { Customer } from "./models/Customer";
import { mixins } from "./mixins/mixins";
import Swal from "sweetalert2";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// const db = new DB().createDatabase();
const product = new Product();
const helper = new Helper();
const locality = new Locality();
const customer = new Customer();
const ws = new Ws();
const db = new DB();
const user = new User();
const cashier = new Cashier();
export default {
  // mixins:[mixins],
  data() {
    return {
      paymentInfo: [],
      receiving: false,
      tabIndex: 0,
      tab: 0,
      products: [],
      localities: [],
      cart: [],
      search: "",
      cashierIsOpen: false,
      paymentsFormats: [
        { id: 1, collumn: "money", name: "Dinheiro" },
        { id: 2, collumn: "debit", name: "Débito" },
        { id: 3, collumn: "credit", name: "Crédito" },
        { id: 4, collumn: "ticket", name: "Ticket" },
      ],
      cashiers: [],
      order: {},
      custom: [],
    };
  },
  async mounted() {
    this.getCashiers();
    await this.isOpen();
    this.localities = await locality.all();
    this.initLoginProccess();
    // await ws.loadAll();

    document.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        if (this.tab === 0 || this.tab === 1) {
          let inputProd = document.getElementById("input-product");
          let inputQtd = document.getElementById("input-qtd");

          if (this.tab === 1) {
            inputProd = document.getElementById("input-product-delivery");
            inputQtd = document.getElementById("input-qtd-delivery");
          }

          if (inputProd.value !== "") {
            if (inputQtd === document.activeElement) {
              inputProd.focus();
              let inputProdValue = inputProd.value;
              let inputQtdValue = inputQtd.value;
              inputQtd.value = 1;
              inputProd.value = "";
              this.insertProdInCart(inputProdValue, inputQtdValue);
              return;
            }
            inputQtd.focus();
          }
        }
      }
    });
  },
  methods: {
    formatMoney(value) {
      return helper.formatMoney(value);
    },

    async insertProdInCart(inputProdValue, inputQtdValue) {
      let prod = await product.selectProdutcToCart(inputProdValue);
      prod[0].qtd = inputQtdValue;
      this.cart.push(JSON.parse(JSON.stringify(prod[0])));
      // inputProduct.value = "";
      // inputQtd.value = "1";
      // this.search = "";

      // inputProd.value = "";
      console.log("Inserido no carrinho");
    },

    closeOrder() {
      this.receiving = true;
      let html =
        '<select id="swal2-select" class="swal2-select" name=""><option selected value disabled>Selecione</option>';
      this.paymentsFormats.forEach((element) => {
        html +=
          '<option value="' + element.name + '">' + element.name + "</option>";
      });
      html += '<input id="swal-input1" placeholder="Nome" class="swal2-input">';

      html += "<div class='row'>";
      html += "<div class='col-6 text-left'>";
      html += "Total a receber: "
      html += "</div>";
      html += "<div class='col-6 text-right'>";
      html += helper.formatMoney(this.computedOrderAmount);
      html += "</div>";
      html += "</div>";

      html += '<hr>';
      html += "<div class='row'>";
      if(this.computedPaymentAmount > 0){
        this.paymentInfo.forEach((element) => {
          html += "<div class='col-6 text-left'>";
          html += Object.keys(element)
          html += "</div>";
          html += "<div class='col-6 text-right'>";
          html += helper.formatMoney(Object.values(element))
          html += "</div>";
        });
      }else{
        html += "<div class='col-12 text-center text-danger'>";
        html += "Nehum valor lançado";
        html += "</div>";
      }
      html += "</div>";

      html += '<hr>';
      html += "<div class='row'>";
      html += "<div class='col-6 text-left'>";
      html += "Total recebido: ";
      html += "</div>";
      html += "<div class='col-6 text-right'>";
      html += helper.formatMoney(this.computedPaymentAmount)
      html += "</div>";
      html += "</div>";
      
      if(this.computedMissedAmount > 0){
        html += "<div class='row'>";
        html += "<div class='col-6 text-left'>";
        html += "Falta: ";
        html += "</div>";
        html += "<div class='col-6 text-right'>";
        html += this.formatMoney(this.computedMissedAmount)
        html += "</div>";
        html += "</div>";
      }

      if(this.computedChangeAmount > 0){
        html += "<div class='row'>";
        html += "<div class='col-6 text-left'>";
        html += "Troco: ";
        html += "</div>";
        html += "<div class='col-6 text-right'>";
        html += this.formatMoney(this.computedChangeAmount)
        html += "</div>";
        html += "</div>";
      }
      Swal.fire({
        title: "Informações de pagamento",
        showCancelButton:true,
        cancelButtonText:"Cancelar",
        showDenyButton: true,
        denyButtonText:"Finalizar pagamento",
        html: html,
        didOpen: () => {
          document.getElementById("swal2-select").focus();

          if(this.computedMissedAmount > 0){
            Swal.getDenyButton().disabled = true
          }
        },
        preConfirm: () => {
          let format = document.getElementById("swal2-select").value;
          let value = document.getElementById("swal-input1").value;

          if (format === "") {
            Swal.showValidationMessage("Informe uma forma de recebimento");
            Swal.getDenyButton().disabled = true
          } else if (value === "") {
            Swal.showValidationMessage("Informe um valor");
            Swal.getDenyButton().disabled = true
          }
          return { [format]: parseFloat(value) };
        },
        allowEnterKey: true,
      }).then((result) => {
        if(result.isConfirmed){
          this.paymentInfo.push(result.value);
          this.receiving = false;
          document.getElementById("input-product").focus();
          this.closeOrder();
        }else if(result.isDismissed){
          this.paymentInfo = []
        }else{
          // this.paymentInfo = []
          Swal.fire({
            icon:"question",
            title:"Finalizar recebimento?",
            showCancelButton: true,
            cancelButtonText:"Cancelar"
          }).then((result)=>{
            if(result.isDismissed){
              this.closeOrder()
            }
          })
        }
      });
    },

    removeItem(index) {
      Swal.fire({
        title: "Remover item?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.cart.splice(index, 1);
        }
      });
    },

    changeTab(tabIndex) {
      this.tab = tabIndex;
      this.cart = [];
      if (tabIndex == 1) {
        this.custom = {};
        this.initDeliveryOrder();
      } else if (tabIndex == 0) {
        setTimeout(() => {
          document.getElementById("input-product").focus();
        }, 200);
      }
    },

    initDeliveryOrder() {
      let name = "";
      let phone = "";
      let address = "";
      let locality = "";
      let customerResult = {};
      Swal.fire({
        title: "Buscar cliente",
        input: "text",
        inputPlaceholder: "Telefone do cliente",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        inputAttributes: {
          maxlength: 11,
        },
        preConfirm: (value) => {
          if (!value) {
            Swal.showValidationMessage("Digite o telefone do cliente");
          } else {
            return value;
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          customerResult = await customer.find(result.value);

          phone = result.value;
          let html =
            '<select id="swal2-select" class="swal2-select" name=""><option selected value disabled>Cidade</option>';
          this.localities.forEach((element) => {
            html +=
              '<option value="' +
              element.id +
              '">' +
              element.name +
              "</option>";
          });
          html += "</select>";
          Swal.fire({
            title: "Novo cliente",
            html:
              '<input id="swal-input1" placeholder="Nome" class="swal2-input">' +
              '<input id="swal-input2" maxlength="11" placeholder="Telefone" class="swal2-input">' +
              '<input id="swal-input3" placeholder="Endereço" class="swal2-input">' +
              html,
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            didOpen: () => {
              if (customerResult) {
                name = document.getElementById("swal-input1").value =
                  customerResult[0].name;
                phone = document.getElementById("swal-input2").value =
                  customerResult[0].phone;
                address = document.getElementById("swal-input3").value =
                  customerResult[0].address;
                locality = document.getElementById("swal2-select").value =
                  customerResult[0].locality_id;
              } else {
                document.getElementById("swal-input1").focus();
                phone = document.getElementById("swal-input2").value = phone;
              }
            },
            preConfirm: async () => {
              // if(!customerResult){
              name = document.getElementById("swal-input1").value;
              phone = document.getElementById("swal-input2").value;
              address = document.getElementById("swal-input3").value;
              locality = document.getElementById("swal2-select").value;
              // }

              if (name == "" || phone == "" || address == "") {
                Swal.showValidationMessage("Preencha todos os campos");
              } else if (locality == "") {
                Swal.showValidationMessage("Escolha uma localidade");
              }
              let arraData = [name, phone, address, locality];

              return arraData;
            },
          }).then(async (result) => {
            if (result.isConfirmed) {
              let response = false;
              if (!customerResult) {
                response = await customer.create(result.value);
              } else {
                response = await customer.update(result.value);
              }

              setTimeout(async () => {
                this.custom = await customer.find(phone);
              }, 2000);
              let prod = await product.findByLocalityPhone(phone);
              prod[0].qtd = 1;
              this.cart.unshift(JSON.parse(JSON.stringify(prod[0])));
              let inputProductDelivery = document.getElementById(
                "input-product-delivery"
              );
              inputProductDelivery.focus();
            } else if (result.isDismissed) {
              // this.initDeliveryOrder()
              this.custom = {};
            }
          });
        }
      });
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

          document.getElementById("input-product").focus();
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
          '<option value="' + element.name + '">' + element.name + "</option>";
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
          let value1 = document.getElementById("swal2-select").value;
          let value2 = document.getElementById("swal-input1").value;
          if (value1 == "") {
            Swal.showValidationMessage("Selecione uma forma de recebimento");
            helper.removeValidationMessage();
          } else if (value2 == "") {
            Swal.showValidationMessage("Digite um valor");
            helper.removeValidationMessage();
          } else {
            let exists = false;
            let valueExists = "";
            let key = null;
            let content = document.getElementById("swal2-content");
            amounts.forEach((element) => {
              key += 1;
              if (element.name == value1) {
                Swal.showValidationMessage("Valor já foi inserido");
                helper.removeValidationMessage();
                exists = true;
                valueExists = element.name;
                key = 0;
              }
            });

            if (!exists) {
              // insert element in array
              amounts.push({ name: value1, value: value2 });
              // document.getElementById('swal2-select').value = ''
              // document.getElementById('swal-input1').value = ''
              if (document.getElementById("table_resume_close")) {
                document.getElementById("table_resume_close").remove();
              }
              content.innerHTML += helper.getHtmlResumeCashier(amounts);
              let btnRemove = document.querySelector("#" + value1);
              btnRemove.addEventListener("click", (e) => {
                let index = amounts.findIndex((x) => x.name === e.target.id);
                amounts.splice(index, 1);
                document.querySelector("." + e.target.id).remove();
              });
            } else {
              helper.removeValidationMessage();
            }
          }

          if (keepOpen) {
            return new Promise(function (resolve) {
              // let content = document.getElementById('swal2-content')
              // if(document.getElementById("table_resume_close")){
              //   document.getElementById("table_resume_close").remove();
              // }
              // content.innerHTML += helper.getHtmlResumeCashier(amounts);
              Swal.enableButtons();
            });
          }
        },
      }).then(async (result) => {
        if (result.isDenied) {
          Swal.fire({
            title: "Lançar valores?",
            text: "Esta operação não poderá ser desfeita",
            html: helper.getHtmlResumeCashier(amounts),
            showCancelButton: true,
            cancelButtonText: "Cancelar",
          }).then(async (result) => {
            if (result.isConfirmed) {
              let resp = await cashier.update(amounts);

              console.log(resp);
              if (resp) {
                setTimeout(async () => {
                  await this.isOpen();
                }, 1000);
                this.getCashiers();
                Swal.fire({
                  title: "Caixa fechado",
                  icon: "success",
                });
              } else {
                Swal.fire({
                  title: "Erro ao fechar o caixa",
                  icon: "error",
                });
              }
            }
          });
        }
        // let auth = await user.auth(result.value[0], result.value[1])
        // if(!auth){
        //   Swal.showValidationMessage('Email e/ou senha estão incorretos!')
        //   this.initLoginProccess()
        // }

        // if(result.value[2]){
        //   localStorage.setItem('email_phone', result.value[0])
        // }else{
        //   localStorage.removeItem('email_phone')
        // }
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
    computedMissedAmount(){
      let total = this.computedOrderAmount - this.computedPaymentAmount
      
      return total; 
    },
    computedPaymentAmount() {
      let total = 0;
      let values = [];

      this.paymentInfo.forEach((element) => {
        total += parseFloat(Object.values(element)[0]);
      });

      return total;
    },

    computedOrderAmount() {
      let total = 0;
      this.cart.forEach((element) => {
        total += parseFloat(element.price) * element.qtd;
      });
      return total;
    },

    computedChangeAmount(){
      return this.computedPaymentAmount - this.computedOrderAmount;
    },

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
      let sql =
        "SELECT * from products where name like '%" +
        e +
        "%' OR price like '%" +
        e +
        "%' limit 20";
      this.products = await db.select("products", sql);
    },
  },
};
</script>
<style lang="scss">
</style>
