<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="red lighten-2"
          dark
          @click="loadProductsFromCloud"
        >
          Carregar produtos
        </v-btn>
      </template>

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Produtos carregados
        </v-card-title>

        <v-card-text class="text-center">
          {{products.length}}
        </v-card-text>
        <v-card-text class="text-center">
          produtos carregados
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import sqlite from '../mixins/sqlite'
import axios from 'axios'
export default {
  mixins:[sqlite],
  components: {},
  data() {
    return {
      dialog: false,
      id: 1,
      name: null,
      price: null,
      alignment: "end",
      products: []
    };
  },

  mounted(){
  //  this.loadProducts();
  console.log(this.products)
  },

  methods:{
  loadProductsFromCloud() {
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
      axios.defaults.headers.common["Access-Control-Allow-Headers"] = "Content-Type";
      axios.defaults.headers.common["Authorization"] = "Bearer fHVgJ82pS2AufhNM1Um4FwAZsqEKHtLRKRYq0uhy7hOf8pHUL8wNY6qRTKmf";
      axios
        .get("https://ebsis.herokuapp.com/api/products")
        .then(response => {
          this.products = response.data;
            this.insertProduct(response.data);
            this.dialog = true;
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
