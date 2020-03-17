<template>
  <div>
    <v-row justify="center">
      <v-col cols="6" sm="12" md="8">
        <v-card style="max-height:600px;" class="mx-auto" outlined>
          <v-simple-table height="500px">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Produto</th>
                  <th class="text-left">Valor</th>
                  <th class="text-left">qtd</th>
                  <th class="text-center">Opções</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in cart" :key="i">
                  <td>{{ p.name }}</td>
                  <td>{{ p.price }}</td>
                  <td>1</td>
                  <td align="end">
                <v-btn style="margin-left: 2px;" class="primary">+</v-btn>
                <v-btn class="primary">-</v-btn>
                <v-btn class="primary" @click="removeFromCart(p,i)">Remover</v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-card-actions>
            <v-row>
              <v-col>
                <v-btn class="primary">Receber</v-btn>
              </v-col>
              <v-col>
                <v-btn class="danger">Cancelar</v-btn>
              </v-col>
              <v-col>
                <v-label align="end">{{total.toFixed(2)}}</v-label>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
        <!-- <v-btn align="end" cols="6" sm="12" md="4">Buscar</v-btn> -->
        <!-- <v-btn align="end" cols="6" sm="12" md="4" @click="dropTableProducts">Deletar produtos</v-btn> -->
      </v-col>
      <v-col cols="6" sm="12" md="4">
        <v-text-field v-model="search" @keyup.down.native="onSubmit"></v-text-field>
        <!-- <v-text-field ref="focusable"></v-text-field> -->
        <v-simple-table>
          <tbody>
            <tr @click="insertInCart(item)" v-for="item in filterProducts" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.price }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
import sqlite from "../mixins/sqlite";
import bcrypt from "bcrypt";

export default {
  mixins: [sqlite],
  components: {},
  data() {
    return {
      items: [],
      value: "",
      alignment: "end",
      cart: [],
      search: "",
      searchInput: "",
      pwd: ""
    };
  },

  mounted() {
    this.selectProducts();
    this.testeBcrypt("12345678");
  },

  methods: {
    insertInCart(p) {
      this.search=""
      this.cart.unshift(p);
    },
    removeFromCart(p, index) {
      this.cart.splice(index, 1);
    },
    onSubmit() {
      // this.$refs.focusable.$el.focus();
      console.log("hi");
    },
    testeBcrypt(text) {
      let vm = this;
      bcrypt.hash(text, 10, function(err, hash) {
        vm.pwd = hash;
      });
    },
    testeBcrypt2(text) {
      let vm = this;
      bcrypt.compare(text, vm.pwd, function(err, result) {
        console.log(result);
      });

      // console.log(r)
    }
  },

  computed: {
    total() {
      let total = 0;
      this.cart.forEach(element => {
        total += element.price;
      });

      return total;
    },

    filterProducts: function() {
      let filtered = [];
      if (this.search) {
        filtered = this.localProducts.filter(
          m => m.name.toLowerCase().indexOf(this.search) > -1
        );
      }
      // if (this.select) {
      //   filtered = filtered.filter(
      //     m => m.gender.toLowerCase() === this.select.toLowerCase()
      //   );
      // }
      return filtered;
    }
  }
};
</script>
