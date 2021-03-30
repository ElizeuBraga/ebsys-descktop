<template>
  <div>
    <b-row>
      <b-col cols="4">
        <label>Nome do produto:</label>
        <b-form-input
          v-model="search"
          class="swal2-input"
          :list="'producs' + tabIndex"
          :id="'input-product' + orderType"
        ></b-form-input>
        <datalist :id="'producs' + orderType">
          <option v-for="(p, index) in products" :value="p.name" :key="index">
            {{ parseFloat(p.price).toFixed(2).replace(".", ",") }}
          </option>
        </datalist>
      </b-col>
      <b-col cols="2">
        <label>Quantidade:</label>
        <b-form-input
          min="1"
          value="1"
          type="number"
          class="swal2-input"
          @input="preventInputQtd()"
          :id="'input-qtd' + orderType"
        ></b-form-input>
      </b-col>
      <!-- <b-row style="background-color:red; height:90%"> -->
      <b-col cols="6" class="text-center">
        <label for=""
          >{{ customer.name }} - {{ customer.phone }} -
          {{ customer.address }}</label
        >
        <div style="overflow-y: scroll; max-height: 87vh; width: 100%">
          <table class="table table-striped" style="background-color: white">
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
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { DB } from "../models/DB";
import EventBus from "../EventBus";
import { City } from "../models/City";
import { Item } from "../models/Item";
import mixins from "../mixins/mixins";
import { Order } from "../models/Order";
import { Helper } from "../models/Helper";
import { Address } from "../models/Address";
import { Cashier } from "../models/Cashier";
import { Payment } from "../models/Payment";
import { Product } from "../models/Product";
import { Customer } from "../models/Customer";
import { PaymentOrder } from "../models/PaymentOrder";
import { PaymentCashier } from "../models/PaymentCashier";

export default {
  mixins: [mixins],
  props: ["orderType"],
  data: () => ({
    tab: "-",
    next: "",
    cart: [],
    search: "",
    customer: {},
    products: [],
    search_aux: 0,
    insertedInCart: false,
    isCanceledReceivement: false,
    paymentFormatSelected: false,
    paymentFormatSelecting: false,
    paymentFormatInfoInserted: false,
  }),

  async mounted() {
    EventBus.$on("change-tab", (e) => {
      this.reset();
      this.tabIndex = e;
      if (e == 1) {
        this.initDeliveryOrder();
      }
    });
    this.paymentsFormats = await new Payment().all();
  },

  methods: {
    preventInputQtd() {
      let inputQtd = document.getElementById("input-qtd" + this.tabIndex);
      if (inputQtd.value == "") {
        setTimeout(() => {
          inputQtd.value = "1";
        }, 100);
      }
    },

    reset() {
      document.getElementById("input-product1").value = "";
      document.getElementById("input-product0").value = "";
      document.getElementById("input-qtd0").value = 1;
      document.getElementById("input-qtd1").value = 1;
      this.search = "";
      this.cart = [];
      this.products = [];
      this.paymentInfo = [];
      this.customer = {};
    },

    initDeliveryOrder() {
      let name = "";
      let phone = "";
      let address = "";
      let complement = "";
      let city_id = "";
      this.reset();
      this.cart = [];
      Swal.fire({
        input: "text",
        showCancelButton: true,
        title: "Buscar cliente",
        cancelButtonText: "Cancelar",
        inputPlaceholder: "Telefone do cliente",
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
          this.customer = await new Customer().find(result.value);

          let cities = await new City().all();
          phone = result.value;

          let html = '<select id="swal2-select" class="swal2-select" name="">';

          if (!this.customer) {
            html += "<option selected value disabled>Cidade</option>";
          }

          if(!cities){
            Swal.fire({
              icon:"warning",
              title:"Ops!",
              text:"Nenhuma cidade cadastrada, contate o administrador."
            })

            return
          }

          cities.forEach((element) => {
            html += `<option ${
              this.customer && element.id == this.customer.city_id
                ? "selected"
                : ""
            } value="${element.id}">${element.name}</option>`;
          });
          html += "</select>";
          Swal.fire({
            title: "Novo cliente",
            html:
              '<input id="swal-input1" placeholder="Nome" maxlength="50" class="swal2-input">' +
              '<input id="swal-input2" maxlength="11" placeholder="Telefone" class="swal2-input">' +
              '<input id="swal-input3" placeholder="Endereço" maxlength="30" class="swal2-input">' +
              '<input id="swal-input4" placeholder="Complemento" maxlength="30" class="swal2-input">' +
              html,
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            didOpen: () => {
              if (this.customer) {
                name = document.getElementById(
                  "swal-input1"
                ).value = this.customer.name;
                phone = document.getElementById(
                  "swal-input2"
                ).value = this.customer.phone;
                address = document.getElementById(
                  "swal-input3"
                ).value = this.customer.address;
                complement = document.getElementById(
                  "swal-input4"
                ).value = this.customer.complement;
                city_id = document.getElementById(
                  "swal2-select"
                ).value = this.customer.city_id;
              } else {
                document.getElementById("swal-input1").focus();
                phone = document.getElementById("swal-input2").value = phone;
              }
            },
            preConfirm: async () => {
              name = document.getElementById("swal-input1").value;
              phone = document.getElementById("swal-input2").value;
              address = document.getElementById("swal-input3").value;
              complement = document.getElementById("swal-input4").value;
              city_id = document.getElementById("swal2-select").value;

              if (name == "" || phone == "" || address == "") {
                Swal.showValidationMessage("Preencha todos os campos");
              } else if (city_id == "") {
                Swal.showValidationMessage("Escolha uma localidade");
              }

              return {
                name: name,
                phone: phone,
                address: address,
                complement: complement,
                city_id: city_id,
                address_id: this.customer.address_id,
                customer_id: this.customer.id,
              };
            },
          }).then(async (result) => {
            if (result.isConfirmed) {
              let response = false;
              let customer_obj = [
                {
                  id: this.customer ? this.customer.id : undefined,
                  name: result.value.name,
                  phone: result.value.phone,
                },
              ];

              let address_obj = [
                {
                  id: this.customer ? this.customer.address_id : undefined,
                  address: result.value.address,
                  complement: result.value.complement,
                  city_id: result.value.city_id,
                  customer_id: this.customer ? this.customer.id : undefined,
                },
              ];
              if (!this.customer) {
                await new DB().execute("BEGIN;");
                let customer_id = await new Customer().create(customer_obj);
                address_obj[0].customer_id = customer_id;
                let address_id = await new Address().create(address_obj);
                await new DB().execute("COMMIT;");
              } else {
                let response = await new Customer().update(customer_obj);

                if (address_obj[0].id === undefined) {
                  response = await new Address().create(address_obj);
                } else {
                  response = await new Address().update(address_obj);
                }
              }

              setTimeout(async () => {
                let teste = document.getElementById("input-product1");
                teste.focus();
                this.customer = await new Customer().find(phone);
              }, 500);
              let prod = await new Customer().getRate(phone);

              this.insertProdInCart(prod.name, 1);
            } else if (result.isDismissed) {
              this.custom = {};
            }
          });
        }
      });
    },

    async insertProdInCart(inputProdValue, inputQtdValue) {
      let prod = await new Product().selectProdutcByName(inputProdValue);
      if (prod && inputQtdValue != "") {
        prod[0].qtd = inputQtdValue;
        let prod2 = JSON.parse(JSON.stringify(prod[0]));

        this.cart.push(prod2);
        this.search = "";
        this.products = [];
      }

      return;
    },

    async closeOrder() {
      console.log(this.paymentsFormats)
      if(!this.paymentsFormats.length){
        Swal.fire({
          icon:"warning",
          title:"Ops!",
          text:"Nenhuma forma de pagamento cadastrada, contate o adiministrador."
        })

        return
      }
      let html = `<input style="margin-bottom: 2;" id="swal-input1" type="number" min="1" max="${this.paymentsFormats.length}" value="1" placeholder="Valor a receber" class="swal2-input"><br>`;
      this.paymentsFormats.forEach((element) => {
        html += `<span style='font-size: 14'>${element.id}-${element.name} </span>`;
      });
      html +=
        '<input id="swal-input2" placeholder="Valor a receber" class="swal2-input">';

      html += "<div class='row font-big text-success'>";
      html += "<div class='col-6 text-left'>";
      html += "Receber: ";
      html += "</div>";
      html += "<div class='col-6 text-right'>";
      html += this.formatMoney(this.computedOrderAmount);
      html += "</div>";
      html += "</div>";

      html += "<hr>";
      html += "<div class='row font-big'>";
      if (this.computedPaymentAmount > 0) {
        let paymentInfo = await new Payment().tratePayment(this.paymentInfo);
        for await (const iterator of paymentInfo) {
          let paymentName = await new Payment().get(iterator.payment_id);
          html += "<div class='col-6 text-left'>";
          html += paymentName;
          html += "</div>";
          html += "<div class='col-6 text-right'>";
          html += this.formatMoney(iterator.price);
          html += "</div>";
        }
      } else {
        html += "<div class='col-12 text-center text-danger'>";
        html += "Nehum valor lançado";
        html += "</div>";
      }
      html += "</div>";

      html += "<hr>";
      html += "<div class='row font-big text-primary'>";
      html += "<div class='col-6 text-left'>";
      html += "Recebido: ";
      html += "</div>";
      html += "<div class='col-6 text-right'>";
      html += this.formatMoney(this.computedPaymentAmount);
      html += "</div>";
      html += "</div>";

      if (this.computedMissedAmount > 0) {
        html += "<div class='row font-big text-danger'>";
        html += "<div class='col-6 text-left'>";
        html += "Faltam: ";
        html += "</div>";
        html += "<div class='col-6 text-right'>";
        html += this.formatMoney(this.computedMissedAmount);
        html += "</div>";
        html += "</div>";
      }

      if (this.computedChangeAmount > 0) {
        html += "<div class='row font-big text-danger'>";
        html += "<div class='col-6 text-left'>";
        html += "Troco: ";
        html += "</div>";
        html += "<div class='col-6 text-right'>";
        html += this.formatMoney(this.computedChangeAmount);
        html += "</div>";
        html += "</div>";
      }
      Swal.fire({
        title: "Informações de pagamento",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Finalizar",
        html: html,
        didOpen: () => {
          if (this.computedMissedAmount > 0) {
            document.getElementById("swal-input1").focus();
          }
          document.getElementById("swal-input2").value =
            this.computedMissedAmount > 0 ? this.computedMissedAmount : 0;
        },
        preConfirm: () => {},
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "question",
            title: "Finalizar recebimento?",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
          }).then(async (result) => {
            if (result.isDismissed) {
              this.closeOrder();
            } else if (result.isConfirmed) {
              let customer_id = null;
              if (this.customer.id !== undefined) {
                customer_id = this.customer.id;
              }

              let response_cashier = await new Cashier().detail();

              await new DB().execute("BEGIN;");
              //insert the order
              let order_id = await new Order().create([
                {
                  cashier_id: response_cashier.id,
                  customer_id: customer_id,
                  order_types_id: this.tabIndex + 1,
                },
              ]);

              // insert items
              let items = [];
              for await (const iterator of this.cart) {
                items.push({
                  quantity: iterator.qtd,
                  product_id: iterator.id,
                  price: iterator.price,
                  order_id: order_id,
                });
              }

              let item_id = await new Item().create(items);

              // insert payments order
              let paymentsOrder = [];
              for await (const iterator of this.paymentInfo) {
                paymentsOrder.push({
                  order_id: order_id,
                  payment_id: iterator.payment_id,
                  price:
                    iterator.payment_id == 1 &&
                    iterator.price > this.computedChangeAmount
                      ? iterator.price - this.computedChangeAmount
                      : iterator.price,
                });
              }

              let payment_id = await new PaymentOrder().create(paymentsOrder);

              await new DB().execute("COMMIT;");

              this.reset();
            }
          });
        } else {
          this.paymentInfo = [];
        }
      });
    },

    removeItem(index) {
      Swal.fire({
        icon: "question",
        title: "Remover item?",
        text:"Esta ação não poderá ser desfeita.",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.cart.splice(index, 1);
        }

        let inputProd = document.getElementById(
          "input-product" + this.tabIndex
        );
        inputProd.focus();
      });
    },

    testaRemve() {
      console.log("Testa remove");
    },
  },
  watch: {
    paymentInfo() {},

    cart() {
      this.computedOrderAmount;
    },

    async search(e) {
      if (this.tabIndex == 1 && this.customer.name == undefined) {
        this.initDeliveryOrder();
        return;
      }
      this.products = await new Product().selectProdutcToCart(e);

      var opts = document.getElementById("producs" + this.tabIndex).childNodes;

      if (this.search_aux == 0) {
        this.search_aux++;
        document.addEventListener(
          "keypress",
          async (e) => {
            e.stopPropagation();
            let swalInput1 = document.getElementById("swal-input1");
            let swalInput2 = document.getElementById("swal-input2");

            let inputProd = document.getElementById(
              "input-product" + this.tabIndex
            );
            let inputQtd = document.getElementById("input-qtd" + this.tabIndex);

            if (e.key === "Enter") {
              if (swalInput1 === document.activeElement) {
                swalInput2.focus();
                swalInput2.select();
                return;
              }

              if (swalInput2 === document.activeElement) {
                if (this.computedMissedAmount > 0 || this.tabIndex == 2) {
                  let paymentInfo = {
                    payment_id: swalInput1.value,
                    price: swalInput2.value,
                  };
                  this.paymentInfo.push(
                    JSON.parse(JSON.stringify(paymentInfo))
                  );
                  setTimeout(() => {
                    swalInput2.focus();
                  }, 100);

                  if (this.tabIndex === 2) {
                    this.closeCashier();
                  } else {
                    this.closeOrder();
                  }
                }
                return;
              }

              if (
                inputQtd === document.activeElement &&
                inputProd.value != ""
              ) {
                if (!(await new Cashier().isOpen())) {
                  Swal.fire({
                    title: "Caixa fechado!",
                    text: "Abra o caixa",
                    icon: "error",
                  }).then((result) => {
                    
                  });
                  return;
                }
                await this.insertProdInCart(inputProd.value, inputQtd.value);

                inputQtd.value = 1;
                inputProd.value = "";
                this.search = "";
                this.products = [];

                inputProd.focus();

                return;
              }

              if (
                inputQtd === document.activeElement &&
                inputProd.value == ""
              ) {
                inputQtd.value = 1;
                inputProd.value = "";
                this.search = "";
                this.products = [];
                inputProd.focus();
                return;
              }

              if (
                inputProd === document.activeElement &&
                inputProd.value == "" &&
                this.cart.length > 0
              ) {
                this.closeOrder();
                return;
              }
            }
          },
          true
        );
      }

      let inputQtd = document.getElementById("input-qtd" + this.tabIndex);
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === e) {
          inputQtd.focus();
          break;
        }
      }
    },
  },

  computed: {
    customerIsEmpty() {
      if (this.index == 1) {
        return this.customer.name == undefined;
      }
    },

    computedChangeAmount() {
      let total = this.computedPaymentAmount - this.computedOrderAmount;
      return parseFloat(total);
    },

    computedMissedAmount() {
      let total = this.computedOrderAmount - this.computedPaymentAmount;

      return parseFloat(total).toFixed(2);
    },

    computedOrderAmount() {
      let total = 0;
      this.cart.forEach((element) => {
        total += parseFloat(element.price) * element.qtd;
      });

      EventBus.$emit("amount-computed", total);
      return parseFloat(total).toFixed(2);
    },
    computedPaymentAmount() {
      let total = 0;
      let values = [];

      this.paymentInfo.forEach((element) => {
        total += parseFloat(element.price);
      });

      return parseFloat(total).toFixed(2);
    },
  },
};
</script>
