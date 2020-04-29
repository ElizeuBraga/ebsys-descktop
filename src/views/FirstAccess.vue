<template>
  <div>
    <v-container :style="{height:'90vh'}">
      <v-row>
        <v-col>
          <!-- Login-->
          <v-card elevation="12" class="mx-auto mt-12" max-width="50%">
            <p class="text-center display-1">Primeiro accesso</p>
            <v-progress-linear indeterminate :color="myColor" v-show="loading"></v-progress-linear>
            <v-row justify="center">
              <v-col cols="10">
                <v-text-field label="Nome" v-model="name" :rounded="true" :disabled="loading" solo></v-text-field>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  :class="styleFields"
                  :rounded="true"
                  type="email"
                  label="Email"
                  v-model="email"
                  :disabled="loading"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  :class="styleFields"
                  :rounded="true"
                  type="phone"
                  label="Telefone"
                  v-model="phone"
                  :disabled="loading"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  :class="styleFields"
                  :rounded="true"
                  type="password"
                  label="Senha"
                  v-model="password"
                  :disabled="loading"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  :class="styleFields"
                  :rounded="true"
                  type="confirm_password"
                  label="Confirme a senha"
                  v-model="confirm_password"
                  :disabled="loading"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="10">
                <v-btn
                  width="100%"
                  :style="{background:myColor, color:'white'}"
                  @click="saveAdmin"
                  :disabled="loading || checkInputs"
                  rounded
                  v-show="!login"
                >Salvar</v-btn>
                <p class="text-center" :style="{color:'red'}">Atenção! Este usuario será o administrador do sistema.</p>
                <p v-show="message" class="text-center" :style="{color:'red'}">Ok, você será redirecionado!</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <!-- Login-->
    </v-container>
  </div>
</template>
<script>
// @ is an alias to /src
import mixins from "./../mixins/mixins";
import EventBus from "../EventBus";
import bcrypt from "bcryptjs";
import axios from "axios";

export default {
  mixins: [mixins],
  components: {},
  name: "Login",
  data() {
    return {
        message:false,
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      title: "Criar banco de dados",
      config: true,
      database: true,
      admin: false,
      styleFields: {
        "text-center": true
      },
      styleTitle: {
        "font-weight-light": true,
        "display-1": true,
        "text--primary": true,
        color: "red"
      },
      login: true,
      store: {},
      stores: [],
      rememberEmailadress: false,
      selectStore: false,
      loading: false,
      alert: false
    };
  },

  mounted() {
      this.createDataBaseStructure();
    if (localStorage.email) {
      this.email = localStorage.email;
    }
    if (localStorage.employees) {
      this.login = false;
      this.employees = JSON.parse(localStorage.employees);
    }
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
    saveAdmin() {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
          this.db.run("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [
            this.name,
            this.email,
            this.phone,
            hash,
            "admin"
          ]);

          this.db.run("UPDATE system SET status = ? WHERE rowid = 1", ([1]));
        });
      });
        this.message = true
        setTimeout(()=>{
            this.$router.push('/')
        }, 3000);
    }
  }
};
</script>

<style scoped>
</style>  