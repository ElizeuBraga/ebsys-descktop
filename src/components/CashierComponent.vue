<template>
  <div>
    <b-row style="min-width: 50%">
      <b-col cols="6">
        <div class="text-center">Meus caixas</div>
        <div style="overflow-y: scroll; max-height: 87vh">
          <table class="table table-striped" style="background-color: white">
            <thead>
              <tr>
                <th class="text-center" scope="col">Valor</th>
                <th class="text-center" scope="col">Data de abertura</th>
                <th class="text-center" scope="col">Data Fechamento</th>
                <th class="text-center" scope="col">Opções</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i, index) in cashiers" :key="index" :id="i.id">
                <td class="text-center">
                  {{ parseFloat(i.value).toFixed(2).replace(".", ",") }}
                </td>
                <td class="text-center">{{ i.created_at }}</td>
                <td class="text-center">{{ i.updated_at }}</td>
                <td class="text-center">
                  <button
                    title="Todos"
                    @click="getCashierInfo(i.id, 'T')"
                    class="btn btn-secondary btn-sm mr-1"
                  >
                    T
                  </button>
                  <button
                    title="Balcão"
                    @click="getCashierInfo(i.id, 'B')"
                    class="btn btn-primary btn-sm mr-1"
                  >
                    B
                  </button>
                  <button
                    title="Delivery"
                    @click="getCashierInfo(i.id, 'D')"
                    class="btn btn-success btn-sm mr-1"
                  >
                    D
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-col>

      <b-col cols="6">
        <div class="text-center">{{ itemsCashierTitle }}</div>
        <div style="overflow-y: scroll; max-height: 87vh">
          <table class="table table-striped" style="background-color: white">
            <thead>
              <tr>
                <th scope="col">Produto</th>
                <th class="text-center" scope="col">Preço X Quantidade</th>
                <th class="text-center" scope="col">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i, index) in items" :key="index">
                <td>{{ i.name }}</td>
                <td class="text-center">
                  <strong>R$</strong>
                  {{ parseFloat(i.price).toFixed(2).replace(".", ",") }}
                  <strong>X </strong>{{ i.quantity }} <strong>Unds</strong>
                </td>
                <td class="text-center">
                  {{ parseFloat(i.total).toFixed(2).replace(".", ",") }}
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
import EventBus from "../EventBus";
import { Cashier } from "../models/Cashier";
import { PaymentCashier } from "../models/PaymentCashier";

export default {
  props: ["orderType"],
  data: () => ({
    items: [],
    type: null,
    cashiers: [],
    cashier_id: null,
    itemsCashierTitle: "Todos",
  }),

  async mounted() {
    EventBus.$on("change-tab", (e) => {});

    EventBus.$on("cashier-closed", async (e) => {
      this.getCashiers();
    });

    await this.getCashiers();
    if (this.cashiers.length > 0) {
      this.items = await new Cashier().getCashierInfo(this.cashiers[0].id);
    }
  },

  methods: {
    async getCashierInfo(cashier_id, type = "T") {
      if (type == "B") {
        this.itemsCashierTitle = "Balcão";
      } else if (type == "D") {
        this.itemsCashierTitle = "Delivery";
      } else {
        this.itemsCashierTitle = "Todos";
      }

      this.cashier_id = cashier_id;
      this.type = type;
      this.items = await new Cashier().getCashierInfo(cashier_id, type);
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
          this.cashiers = await new Cashier().all(result.value);
        });
      } else {
        this.cashiers = await new Cashier().all();
      }
    },
  },
  watch: {
    items() {
      this.computedAmountItems;
    },
  },

  computed: {
    async computedAmountItems() {
      let total = 0;
      
      let detailPayments = await new PaymentCashier().paymentsForCashier(
        this.cashier_id,
        this.type
      );

      detailPayments.forEach((element) => {
        total += parseFloat(element.total);
      });

      detailPayments.push({ name: "Total", total: total });
      EventBus.$emit("amount-computed-items", [total, detailPayments]);
      return parseFloat(total).toFixed(2);
    },
  },
};
</script>
