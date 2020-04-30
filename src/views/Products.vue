<template>
  <!-- <v-container min-width="100%" :style="{background:'red'}"> -->
    <v-row justify="center" :style="{background:'',  margin:'0px 4px 0px 4px'}">
      <v-col cols="8" :style="{background:''}">
        <v-simple-table height="89vh">
          <v-progress-linear indeterminate :color="myColor" v-show="loading"></v-progress-linear>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Id</th>
                <th class="text-left">Nome</th>
                <th class="text-left">Preço</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products" :key="p.rowid">
                <td>{{ p.rowid }}</td>
                <td>{{ p.name }}</td>
                <td>{{ p.price }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="4" :style="{background:''}">
        <v-card>
          <v-row justify="center">
            <v-col cols="10">
              <p :style="{'text-decoration':'underline'}" class="text-center">Novo Produto</p>
            </v-col>
            <v-col cols="10">
              <v-text-field outlined label="Nome" v-model="name" rounded></v-text-field>
            </v-col>
            <v-col cols="10">
              <v-text-field outlined label="Preço" rounded v-model.lazy="price" v-money="money"></v-text-field>
            </v-col>
            <v-col cols="10">
              <v-btn :style="{background:myColor, color:'white'}" rounded @click="save" label="Preço" width="100%">Salvar</v-btn>
              <!-- <v-btn  @click="createDataBaseStructure" label="Preço" width="100%">Reseta banco</v-btn> -->
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

  <!-- </v-container> -->
</template>

<script>
import mixins from "../mixins/mixins";
import {VMoney} from 'v-money'
export default {
  mixins: [mixins],
  components: {},
  directives: {money: VMoney},
  data() {
    return {
      money: {
          decimal: ',',
          thousands: '.',
          precision: 2,
          masked: false /* doesn't work with directive */
        },
      products:[],
      loading: false,
      dialog: false,
      name: "",
      price: "",
      alignment: "end",
      qtdDataReturned: 0
    };
  },

  mounted() {
    this.db.each("SELECT rowid, name, price FROM products", (err, row) => {
      this.products.push(row);
    });
  },

  computed:{
    
  },

  methods: {
    save(){
      this.db.run("INSERT INTO products VALUES (?, ?)", [this.name,parseFloat(this.price)]);
      this.name = ""
      this.price = ""
    }
  }
};
</script>
