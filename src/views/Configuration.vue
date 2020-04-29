<template>
  <div>
    <v-container :style="{height:'90vh'}">
      <v-row>
        <v-col>
          <!-- card config sistema -->
          <v-card v-show="config" elevation="12" class="mx-auto mt-12" max-width="50%">
            <v-progress-linear indeterminate :color="myColor" v-show="loading"></v-progress-linear>

              <!-- database -->
                <v-col v-show="database" cols="10">
                  <v-btn
                    rounded
                    width="100%"
                    :style="{background:myColor, color:'white'}"
                    @click="createDataBaseStructure"
                  >Criar banco de dados</v-btn>
                </v-col>
              <!-- database -->

              <!-- admin -->
              <v-row v-show="admin" justify="center">
                <v-col cols="10">
                  <v-text-field
                    label="Nome"
                    v-model="name"
                    :rounded="true"
                    :disabled="loading"
                    solo
                  ></v-text-field>
                </v-col>

                <v-col cols="10">
                  <v-text-field
                    label="Email"
                    v-model="email"
                    :rounded="true"
                    :disabled="loading"
                    solo
                  ></v-text-field>
                </v-col>

                <v-col cols="10">
                  <v-text-field
                    label="Telefone"
                    v-model="phone"
                    :rounded="true"
                    :disabled="loading"
                    solo
                  ></v-text-field>
                </v-col>

                <v-col cols="10">
                  <v-text-field
                    label="Senha"
                    v-model="password"
                    :rounded="true"
                    :disabled="loading"
                    solo
                  ></v-text-field>
                </v-col>

                <v-col cols="10">
                  <v-btn
                    rounded
                    width="100%"
                    :style="{background:myColor, color:'white'}"
                    @click="saveAdmin"
                  >Salvar admin</v-btn>
                </v-col>
              </v-row>
          </v-card>
          <!-- admin -->
        </v-col>
      </v-row>
      <!-- --------------- -->
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
      alert: false,
      password: "12345678",
      email: "elizeu@gmail.com"
    };
  },

  mounted() {
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
    loadDataStore() {
      this.loading = true;
      localStorage.setItem("store", JSON.stringify(this.store));
      setTimeout(() => {
        axios
          .get(
            this.host + "stores/" + this.store._id + "/downloadDataFromStore"
          )
          .then(response => {
            this.employees = response.data;
            localStorage.setItem("employees", JSON.stringify(response.data[0]));
            localStorage.setItem("products", JSON.stringify(response.data[1]));
            this.loading = false;
            this.selectStore = false;
            this.login = false;
          })
          .catch(e => {
            // this.stop()
            this.loading = false;
          });
      }, 2000);
    },
    hideAlert() {
      setTimeout(() => {
        this.alert = false;
      }, 4000);
    },
    reset() {
      localStorage.clear();
    },
    goToForgot() {
      this.$router.push("forgotpassword");
    },
    filterEmployees() {
      let filtered = this.employees;

      if (this.email) {
        filtered = this.employees.filter(m => m.email.indexOf(this.email) > -1);
      }

      return filtered;
    },

    loginEmployee() {
      this.loading = true
      let emp = this.filterEmployees()[0]
      setTimeout(()=>{

        if (emp) {
          bcrypt.compare(
            this.password,
            emp.password,
          (err, res) => {
            if (res) {
              if (this.rememberEmailadress) {
                localStorage.setItem("email", this.email);
              }
              this.$router.push("/countertop");
              EventBus.$emit("logged", true);
            } else {
              this.loading = false
              this.alert = true;
              this.hideAlert();
            }
          }
        );
      } else {
        this.loading = false
        this.alert = true;
        this.hideAlert();
      }
      }, 2000)
    },

    loginAdmin() {
      this.loading = true;
      setTimeout(() => {
        axios
          .post(this.host + "users/login", {
            email: this.email,
            password: this.password,
            descktop: "descktop",
            _method: "post"
          })
          .then(response => {
            if (response.status == 200) {
              console.log(response.data[1])
              localStorage.setItem("employees", JSON.stringify(response.data));
              this.employees = JSON.parse(localStorage.employees);
              this.stores = response.data;
              this.selectStore = true;
              this.loading = false;
            }
          })
          .catch(error => {
            this.alert = true;
            this.loading = false;
          });
      }, 2000);
    }
  }
};
</script>

<style scoped>
</style>  