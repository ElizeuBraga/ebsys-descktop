<template>
  <div>
    <v-row justify="center">
      <v-col cols="6" sm="12" md="8">
        <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Calories</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in products" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.price }}</td>
              </tr>
            </tbody>
        </v-simple-table>
      </v-col>
      <v-col cols="6" sm="12" md="4">
        <v-text-field v-model="name" label="Solo" placeholder="Nome" solo></v-text-field>
        <v-text-field v-model="price" label="Solo" placeholder="Preço" solo></v-text-field>
        <v-btn align="end" cols="6" sm="12" md="4" @click="saveProduct">Salvar</v-btn>
        <v-btn align="end" cols="6" sm="12" md="4" @click="dropTables">Drop</v-btn>
        <v-btn align="end" cols="6" sm="12" md="4" @click="loadProductsFromCloud">Load cloud</v-btn>
        <v-btn align="end" cols="6" sm="12" md="4" @click="loadProducts">Load Local</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import sqlite from '../mixins/sqlite'
import axios from 'axios'

export default {
  mixins:[sqlite],
  name: "Balcao",
  components: {},
  data() {
    return {
      id: 1,
      name: null,
      price: null,
      alignment: "end",
      products:[]
    };
  },

  mounted(){
    this.selectProducts();
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
          console.log(response.data)
        })
        .catch(e => {
          if (e.response.status === 401) {
            // localStorage.clear();
            // this.$router.go("/login");
            console.log(e)
          }
        });
    },

    saveProduct(){
      var id = this.products.length + 1;
      this.insertProduct(id, this.name,1, this.price);
    },

    dropTables(){
      this.createTables();
    },

    loadProducts(){
      this.products = []
      this.selectProducts();
    }
  }
};
</script>
