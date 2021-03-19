<template>
  <div>
    <footer class="footer">
      <div class="row">
        <div class="col-6">
          <button
            v-if="cashierIsOpen && tabIndex == 2"
            @click="closeCashier"
            class="btn btn-light text-danger"
          >
            Fechar caixa
          </button>
          <button
            @click="openCashier"
            class="btn btn-light text-success"
            v-else-if="!cashierIsOpen && tabIndex == 2"
          >
            Abrir caixa
          </button>
        </div>
        <div class="col-6" v-if="tabIndex === 2">
          <b-row>
            <b-col style="margin-top: 5px">Vendas</b-col>
            <b-col v-for="(pFc, index) in paymentInfoCashier" :key="index">
              {{ pFc.name }} <br />
              {{ formatMoney(pFc.total) }}
            </b-col>
          </b-row>
        </div>
        <div class="col-6" v-if="tabIndex !== 2">
          <b-row>
            <b-col class="font-big"> Total </b-col>
            <b-col class="font-big"> R$ {{ formatMoney(totalCart) }} </b-col>
          </b-row>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import EventBus from "../EventBus";
import mixins from "../mixins/mixins";
import { Cashier } from "../models/Cashier";
export default {
  mixins: [mixins],
  data: () => ({
    totalCart: 0,
    totalItems: [],
    paymentInfoCashier: [],
  }),

  async mounted() {},

  async created() {
    EventBus.$on("amount-computed-items", (e) => {
      this.totalItems = e[0];
      this.paymentInfoCashier = e[1];
    });

    EventBus.$on("amount-computed", (e) => {
      this.totalCart = e
    });

    this.cashierIsOpen = await new Cashier().isOpen();
  },

  methods: {
    formatMoney(value) {
      return parseFloat(value).toFixed(2).replace(".", ",");
    },

    async openCashier() {
      Swal.fire({
        title: "Abrir caixa?",
        text: "Apenas você ou administrador poderá fechá-lo.",
        icon: "question",
      }).then(async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        await new Cashier().create([
          {
            user_id: user.id,
          },
        ]);

        Swal.fire({
          title: "Caixa aberto",
          icon: "success",
        });

        setTimeout(async () => {
          this.cashierIsOpen = await new Cashier().isOpen();
        }, 1000);
      });
    },
  },
};
</script>
