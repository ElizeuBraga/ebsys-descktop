<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-progress-linear v-show="loading" indeterminate color="orange" style="margin-top:3px"></v-progress-linear>
        <v-btn
          color="red lighten-2"
          dark
          large
          rounded
          style="margin-top:300px"
          @click="loadProductsFromCloud"
        >Carregar produtos</v-btn>

        <v-btn
          color="red lighten-2"
          dark
          large
          rounded
          style="margin-top:300px"
          @click="loadOptionsFromCloud"
        >Carregar Opções</v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Produtos carregados</v-card-title>

        <v-card-text class="text-center">{{qtdDataReturned}}</v-card-text>
        <v-card-text class="text-center">produtos carregados</v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import sqlite from "../mixins/sqlite";
import axios from "axios";
export default {
  mixins: [sqlite],
  components: {},
  data() {
    return {
      loading: false,
      dialog: false,
      id: 1,
      name: null,
      price: null,
      alignment: "end",
      qtdDataReturned:0
    };
  },

  mounted() {
    //  this.loadProducts();
  },

  methods: {
    loadProductsFromCloud() {
      this.loading = true;
      axios
        .get(this.host + "products")
        .then(response => {
          let result = this.manageProducts(response.data);
          result.then((v)=>{
            this.qtdDataReturned = v
            this.dialog = true;
          })
          this.loading = false;
        })
        .catch(e => {
          // console.log(e)
        });
    },

    loadOptionsFromCloud() {
      this.loading = true;
      axios
        .get(this.host + "options")
        .then(response => {
          let result = this.manageOptions(response.data);
          result.then((v)=>{
            this.qtdDataReturned = v
            this.dialog = true;
          })
          this.loading = false;
        })
        .catch(e => {
          // if (e.response.status === 401) {
          //   // localStorage.clear();
          //   // this.$router.go("/login");
          //   console.log(e)
          // }
        });
    }
  }
};
</script>
