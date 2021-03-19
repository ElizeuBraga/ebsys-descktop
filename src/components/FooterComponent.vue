<template>
  <div>
    <footer class="footer">
      <div class="row">
        <!-- <div v-if="tabIndex == 2" class="col-12">
          <div v-for="(p, index) in paymentsFormats" :key="index" class="row">
            <div :class="'col-' + Math.round((12 / paymentsFormats.length))">
              Teste
            </div>
          </div>
        </div> -->
        <div class="col-6">
          <button v-if="cashierIsOpen && tabIndex == 2" @click="closeCashier" class="btn btn-light text-danger">Fechar caixa</button>
          <button v-else-if="!cashierIsOpen && tabIndex == 2" @click="openCashier" class="btn btn-light text-success">Abrir caixa</button>
        </div>
        <div class="col-6" v-if="tabIndex === 2">
          <b-row>
            <b-col style="margin-top: 5px;">Vendas</b-col>
            <b-col v-for="(pFc, index) in paymentInfoCashier" :key="index">
              {{pFc.name}} <br> {{formatMoney(pFc.total)}}
            </b-col>
          </b-row>
        </div>
        <div class="col-6" v-if="tabIndex !== 2">
          <b-row>
            <b-col class="font-big"> Total </b-col>
            <!-- <b-col v-if="tabIndex == 2" class="font-big"> R$ {{ formatMoney(totalItems) }} </b-col> -->
            <b-col class="font-big"> R$ {{ formatMoney(totalCart) }} </b-col>
          </b-row>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import mixins from "../mixins/mixins";
import EventBus from '../EventBus';
import Swal from "sweetalert2";
import { Cashier } from '../models/Cashier';
export default {
  mixins:[mixins],
  data: () => ({
    totalCart: 0,
    paymentInfoCashier:[],
    totalItems:[]
  }),

  async mounted() {
  
  },

  async created(){
    EventBus.$on("amount-computed-items", (e) => {
      this.totalItems = e[0];
      this.paymentInfoCashier = e[1] 
    });

    this.cashierIsOpen = await new Cashier().isOpen();
  },

  methods: {
    formatMoney(value){
        return parseFloat(value).toFixed(2).replace('.', ',')
    },

async openCashier() {
      Swal.fire({
        title:"Abrir caixa?",
        text:"Apenas você ou administrador poderá fechá-lo.",
        icon:"question"
      }).then(async()=>{
        let user = JSON.parse(localStorage.getItem('user'));
        await new Cashier().create([
          {
            user_id: user.id
          }
        ]);

        Swal.fire({
          title:"Caixa aberto",
          icon:"success"
        })

        setTimeout(async () => {
          this.cashierIsOpen = await new Cashier().isOpen();
        }, 1000);
      })
    },
    async closeCashier() {
      this.receiving = true;
      let html = `<input style="margin-bottom: 2;" id="swal-input1" type="number" min="1" max="${this.paymentsFormats.length}" value="1" placeholder="Valor a receber" class="swal2-input"><br>`;
      this.paymentsFormats.forEach(element => {
        html += `<span style='font-size: 14'>${element.id}-${element.name} </span>`
      });
      html +=
        '<input id="swal-input2" placeholder="Valor a lançar" class="swal2-input">';

      // html += "<div class='row font-big text-success'>";
      // html += "<div class='col-6 text-left'>";
      // html += "Receber: ";
      // html += "</div>";
      // html += "<div class='col-6 text-right'>";
      // html += helper.formatMoney(this.computedOrderAmount);
      // html += "</div>";
      // html += "</div>";

      html += "<hr>";
      html += "<div class='row font-big'>";
      if (this.computedPaymentAmount > 0) {
        let paymentInfo = await new Payment().tratePayment(this.paymentInfo);
        for await (const iterator of paymentInfo) {
          // const todo = await fetch(iterator);
          let paymentName = await payment.get(iterator.payment_id);
          html += "<div class='col-6 text-left'>";
          html += paymentName;
          html += "</div>";
          html += "<div class='col-6 text-right'>";
          html += helper.formatMoney(iterator.price);
          html += "</div>";
        }
      } else {
        html += "<div class='col-12 text-center text-danger'>";
        html += "Nehum valor lançado";
        html += "</div>";
      }
      html += "</div>";

      // html += "<hr>";
      // html += "<div class='row font-big text-primary'>";
      // html += "<div class='col-6 text-left'>";
      // html += "Recebido: ";
      // html += "</div>";
      // html += "<div class='col-6 text-right'>";
      // html += helper.formatMoney(this.computedPaymentAmount);
      // html += "</div>";
      // html += "</div>";

      if (this.computedMissedAmount > 0) {
        html += "<div class='row font-big text-danger'>";
        html += "<div class='col-6 text-left'>";
        html += "Faltam: ";
        html += "</div>";
        html += "<div class='col-6 text-right'>";
        html += helper.formatMoney(this.computedMissedAmount);
        html += "</div>";
        html += "</div>";
      }

      // if (this.computedChangeAmount > 0) {
      //   html += "<div class='row font-big text-danger'>";
      //   html += "<div class='col-6 text-left'>";
      //   html += "Troco: ";
      //   html += "</div>";
      //   html += "<div class='col-6 text-right'>";
      //   html += this.formatMoney(this.computedChangeAmount);
      //   html += "</div>";
      //   html += "</div>";
      // }
      Swal.fire({
        title: "Informações do fechamento",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Finalizar",
        html: html,
        didOpen: () => {
          document.getElementById("swal-input1").focus();
          document.getElementById("swal-input2").value = 0;
        },
        preConfirm: () => {
          if(this.paymentInfoCashier.length < 2){
            // console.log(this.paymentInfoCashier)
            return Swal.showValidationMessage("Insira pelo menos um valor")
          }

        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "question",
            title: "Finalizar recebimento?",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
          }).then(async (result) => {
            if (result.isDismissed) {
              this.openCashier();
            } else if (result.isConfirmed) {
              let customer_id = null;
              if (this.customer.id !== undefined) {
                customer_id = this.customer.id;
              }

              let response_cashier = await cashier.detail();
              console.log(response_cashier)

              db.execute("BEGIN;");
              //insert the order
              let order_id = await order.create([
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

              let item_id = await item.create(items);

              // insert payments order
              let paymentsOrder = [];
              for await (const iterator of this.paymentInfo) {
                paymentsOrder.push({
                  order_id: order_id,
                  payment_id: iterator.payment_id,
                  price: (iterator.payment_id == 1 && iterator.price > this.computedChangeAmount) ? (iterator.price - this.computedChangeAmount) : iterator.price
                });
              }

              let payment_id = await paymentOrder.create(paymentsOrder);

              db.execute("COMMIT;");

              this.reset();
            }
          });
          // // this.paymentInfo.push(result.value);
          // // this.receiving = false;
          // // document.getElementById("input-product").focus();
          // this.closeOrder();
        } else {
          this.paymentInfo = [];
        }
      });
    },
  }
};
</script>
