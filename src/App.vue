<template>
  <div class="app-style">
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
:root {
  --blue: #2778c4;
  --white: #faf0e6;
  --gray: #dee2e6;
}

.app-style {
  background-color: var(--gray);
  min-height: 100vh;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  /* font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif; */
}

.swal2-modal {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.card-header {
  border-radius: 0 !important;
  border: #2778c4 !important;
  background-color: var(--blue) !important;
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

/* .swal2-input,
.swal2-input:focus {
  background-color: white;
  border: 2px solid #2778c4;
} */

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
import { Ws } from "./models/Ws";
const Pusher = require("pusher-js");
import mixins from "./mixins/mixins";
import { User } from "./models/User";
import { DB } from "./models/DB";
import EventBus from "../src/EventBus";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import OrderComponent from "./components/OrderComponent.vue";
import CashierComponent from "./components/CashierComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import { Console } from "console";
import { measureMemory } from 'vm';
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

var pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
  cluster: "us2",
});

var channel = pusher.subscribe("insert-channel");
var channel2 = pusher.subscribe("update-channel");

export default {
  mixins: [mixins],
  components: {
    OrderComponent,
    FooterComponent,
    CashierComponent,
  },
  data() {
    return {};
  },
  async mounted() {
    // this.updateData();

    // new DB().backupData();
    this.initLoginProccess();

    channel.bind("insert-event", async (data) => {
      await new DB().execute("BEGIN;");
      for (const element of data) {
        let inserted = false;
        inserted = await new DB().insert(element.table, element.data);

        if (!Number.isInteger(inserted)) {
          await new DB().execute("ROLLBACK");
          console.log(inserted);
          return;
        }
        console.log(element.table + " inserted");
      }

      console.log("Comitando");
      await new DB().execute("COMMIT");

      // await new Ws().downloadDataFromServer("insert");
    });

    channel2.bind("update-event", async (data) => {
      // await new Ws().downloadDataFromServer("update");
    });
  },

  methods: {
    async updateData() {
      await new Ws().downloadDataFromServer("insert");
      await new Ws().downloadDataFromServer("update");
    },

    changeTab(tabIndex) {
      EventBus.$emit("change-tab", tabIndex);
    },

    async initLoginProccess() {
      let html =
        '<input id="swal-input1" placeholder="Email/telefone" class="swal2-input">';
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
        preConfirm: async () => {
          let value1 = document.getElementById("swal-input1").value;
          let value2 = document.getElementById("swal-input2").value;
          let value3 = document.getElementById("swal-input3");

          let message = "";
          if (value1 == "") {
            message = "Digite seu email/telefone";
          } else if (value2 == "") {
            message = "Digite sua senha";
          }else{
            let response = await new User().auth(value1, value2)

            if(response == 'user_not_found'){
              message = "Usuario não encontrado"
            }else if(!response){
              message = "Acesso negado"
            }
          }

          if (message !== "") {
            Swal.showValidationMessage(message);
            message = ""
            return;
            // setTimeout(() => {
            //   document.getElementById("swal2-validation-message").remove();
            // }, 3000);
          }

          return [value1, value2, value3.checked];
        },
      }).then(async (result) => {
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

    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ["bg-primary", "text-light"];
      } else {
        return ["bg-light", "text-info"];
      }
    },
  },

  computed: {},

  watch: {},
};
</script>
<style lang="scss">
.font-big {
  font-size: 25px;
}
</style>
