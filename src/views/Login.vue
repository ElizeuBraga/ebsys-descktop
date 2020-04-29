<template>
  <div>
    <v-container :style="{height:'90vh'}">
      <v-row>
        <v-card elevation="12" class="mx-auto mt-12" max-width="50%">
          <p class="text-center display-1">{{formTitle}}</p>
          <v-row justify="center">
            <v-col cols="10">
              <v-progress-linear indeterminate :color="myColor" v-show="loading"></v-progress-linear>
            </v-col>
            <v-alert
              transition="scale-transition"
              width="80%"
              v-show="alert"
              dense
              outlined
              :type="typeAlert"
            >{{message}}</v-alert>
            <!-- <v-col cols="10" v-show="isCad" >
                <v-text-field
                  label="Nome"
                  v-model="userData.name"
                  :rounded="true"
                  :disabled="loading"
                  solo
                ></v-text-field>
            </v-col>-->
            <v-col cols="10">
              <v-text-field label="Email" v-model="email" :rounded="true" :disabled="loading" solo></v-text-field>
            </v-col>
            <!-- <v-col cols="10" v-show="isCad" >
                <v-text-field
                  label="Telefone"
                  v-model="userData.phone"
                  :rounded="true"
                  :disabled="loading"
                  solo
                ></v-text-field>
            </v-col>-->
            <!-- <v-col cols="10" v-show="isCad" >
                <v-text-field
                  label="Telefone"
                  v-model="userData.phone"
                  :rounded="true"
                  :disabled="loading"
                  solo
                ></v-text-field>
            </v-col>-->
            <v-col cols="10">
              <v-text-field
                :rounded="true"
                type="password"
                label="Password"
                v-model="password"
                :disabled="loading"
                solo
              ></v-text-field>
            </v-col>
            <!-- <v-col v-show="isCad" cols="10">
                <v-text-field
                  :rounded="true"
                  type="password"
                  label="Password"
                  v-model="userData.password"
                  :disabled="loading"
                  solo
                ></v-text-field>
            </v-col>-->
          </v-row>
          <v-row justify="center">
            <v-col cols="10">
              <v-btn
                width="100%"
                :style="{background:myColor, color:'white'}"
                @click="login"
                :disabled="loading || checkInputs"
                rounded
              >Entrar</v-btn>
            </v-col>
          </v-row>
          <div class="text-center">
            <a @click="goToForgot">Esqueci a senha</a>
            <br />
            <a v-show="firstaccess" @click="goToFirstAccess">Primeiro acesso (configurar o sistema)</a>
          </div>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>
<script src="https://js.pusher.com/6.0/pusher.min.js"></script>
<script>
// @ is an alias to /src
import mixins from "./../mixins/mixins";
import EventBus from "../EventBus";
import bcrypt from "bcryptjs";
import axios from "axios";
var Pusher = require("pusher-js");

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;

var pusher = new Pusher("a885cc143df63df6146a", {
  cluster: "us2"
});

export default {
  mixins: [mixins],
  name: "Login",
  data() {
    return {
      firstaccess: false,
      email: "elizeu@gmail.com",
      password: "12345678",
      type: "success",
      message: "",
      alert: false,
      formTitle: "Login",
      typeAlert: "success",
      message: "Acesso negado!",
      loading: false
    };
  },

  mounted() {
    var channel = pusher.subscribe("my-channel");
    channel.bind("my-event", (data) => {
      // app.messages.push(JSON.stringify(data));
      this.db.run("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [
            data.name,
            Math.random(),
            data.phone,
            data.password,
            "admin"
          ]);
      console.log("Salvo no banco de dados");
    });

    this.db.each("SELECT * FROM system where rowid = 1;", (err, row) => {
      row.status == 0 ? (this.firstaccess = true) : "";
    });
  },

  computed: {
    checkInputs() {
      return this.email == "" || this.password == "";
    },

    checkStore() {
      return Object.keys(this.store).length === 0;
    }
  },

  methods: {
    teste() {
      console.log("Oi");
    },
    sendAPusher(data) {
      var pusher = new Pusher({
        appId: "991345",
        key: "a885cc143df63df6146a",
        secret: "9f46c6b5e099dc384db9",
        cluster: "us2",
        encrypted: true
      });

      pusher.trigger("my-channel", "my-event", {
        message: data
      });
    },
    login() {
      this.loading = true;
      let user = null;
      this.db.each(
        "SELECT * FROM users WHERE email = '" + this.email + "'",
        function(err, row) {
          user = row;
          console.log(row);
        }
      );

      setTimeout(() => {
        if (user) {
          bcrypt.compare(this.password, user.password, (err, res) => {
            this.loading = false;
            if (res) {
              if (user.profile == "admin") {
                this.showAlert("success", "Acesso de administrador", 5000);
              } else if (user.profile == "caixa") {
                this.$router.push("countertop");
              } else {
                this.showAlert("error", "Acesso negado");
              }
            } else {
              this.showAlert("error", "Acesso negado");
            }
          });
        } else {
          this.loading = false;
          this.showAlert("error", "Acesso negado");
        }
      }, 1000);
    },
    goToFirstAccess() {
      this.$router.push("/firstaccess");
    },
    goToForgot() {
      this.$router.push({ name: "Forgot", params: { email: this.email } });
    }
  }
};
</script>

<style scoped>
</style>  