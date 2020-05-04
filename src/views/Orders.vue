<template>
  <!-- <v-container min-width="100%" :style="{background:'red'}"> -->
  <v-row justify="center" :style="{background:'',  margin:'0px 4px 0px 4px'}">
    <v-col cols="8" :style="{background:'red'}">
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
            <tr v-for="o in orders" :key="o.id" @click="show(o)">
              <td>{{ o.id }}</td>
              <td>{{ o.user.name }}</td>
              <td>{{ 'R$' + formatPrice(o.total)}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
    <v-col cols="4" :style="{background:''}">
      <v-card>
        <v-row justify="center">
          <v-col cols="10">
            <p><b>Id: </b>{{order.id}}</p>
            <p><b>Cliente: </b>{{order.user.name}}</p>
            <p><b>Produtos:</b></p>
            <p v-for="p in order.products" :key="p.id">{{p.name}}</p>
            <p><b>R$ {{formatPrice(order.total)}}</b></p>
          </v-col>
          <v-col cols="10">
            <v-btn
              :style="{background:myColor, color:'white'}"
              rounded
              @click="save"
              label="Preço"
              width="100%"
            >Salvar</v-btn>
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
import axios from 'axios';
import { VMoney } from "v-money";

var Pusher = require("pusher-js");

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;

var pusher = new Pusher("a885cc143df63df6146a", {
  cluster: "us2"
});

export default {
  mixins: [mixins],
  components: {},
  directives: { money: VMoney },
  data() {
    return {
      money: {
        decimal: ",",
        thousands: ".",
        precision: 2,
        masked: false /* doesn't work with directive */
      },
      sections: [
        { id: 1, name: "Bebidas" },
        { id: 2, name: "Pratos" }
      ],
      img:"",
      selected: {},
      dsc:"",
      products: [],
      loading: false,
      dialog: false,
      name: "",
      price: "",
      alignment: "end",
      qtdDataReturned: 0,
      orders: [],
      order:{
        user:{}
      }
    };
  },

  mounted() {
    var channel = pusher.subscribe("new-order");
    channel.bind("App\\Events\\NewOrder", (data) => {
      // this.orders = data
      // console.log(data.order.original[0]);
      this.orders.unshift(data.order.original[0]);
    });
    axios
        .get(this.host + "orders")
        .then(response => {
          // handle success
          this.order = response.data[0]
          this.orders = response.data
          // response.data.forEach(element => {
            //   element.section_id == 1
          //     ? this.drinks.push(element)
          //     : this.plates.push(element);
          // });
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        })
        .then(function() {
          // always executed
        });
  },

  computed: {},
  watch: {
    selected(e) {
      console.log(e);
    }
  },

  methods: {
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    save() {
      axios
        .post(this.host + "products", {
          name: this.name,
          price: parseFloat(this.price),
          section_id: this.selected.id,
          img: this.img,
          dsc: this.dsc
        })
        .then(function(response) {
          console.log(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    show(p){
      this.order = p
    }
  }
};
</script>
