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
                    <v-btn class="primary" @click="showOptions(p, i)">Ver</v-btn>
                    <v-btn class="primary">+</v-btn>
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

        <v-dialog v-model="dialog" width="500">
          <v-card>
            {{obj.name}}
            <v-chip
              v-for="(obs,i) in obj.aux"
              :key="i"
              class="ma-2"
              close
              color="teal"
              text-color="white"
              @click:close="removeObservation(obj, i)"
            >{{obs}}</v-chip>
            <v-text-field
              v-model="moreOption"
              ref="obs"
              v-on:keydown="afterObs"
              placeholder="Outras Observações"
            ></v-text-field>
            {{moreOption}}
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="6" sm="12" md="4">
        <v-autocomplete
          ref="seletion"
          v-model="aux"
          dense
          :items="products"
          :filter="customFilter"
          @input="afterselection"
          color="white"
          item-text="name"
          label="Selecione"
          return-object
          :auto-select-first="true"
          :clearable="true"
        ></v-autocomplete>
        <v-text-field v-model="qtd" v-on:keydown="afterselectionPrice" type="number" ref="qtd"></v-text-field>
        <v-card height="200">
          <v-row style="margin-left:3px margin-top:4px" v-for="(c, i) in cart" :key="i">
              <div md="12"><b>{{c.name}}-</b></div>
              <div class="float-sm-left" margin v-for="(ca, j) in c.aux" :key="j">{{ca}} ,</div>
            </v-row>
        </v-card>
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
      obj: {},
      moreOption: "",
      selected: [],
      dialog: false,
      qtd: 1,
      options: [],
      products: [],
      aux: {},
      items: [],
      value: "",
      alignment: "end",
      cart: [],
      index: 0,
      search: "",
      searchInput: "",
      pwd: "",
      dialogOptions: false,
      arrDialogOptions: []
    };
  },

  mounted() {
    let products = this.selectProducts();
    products.then(p => {
      this.products = p;
    });

    let options = this.selectOptions();
    options.then(o => {
      this.options = o;
    });
  },

  methods: {
    removeObservation(obj, i) {
      obj.aux.splice(i, 1);
      this.obj.aux.splice(i, 1);
      // arrDial.splice(i, 1)
    },

    showOptions(p, i) {
      this.obj = p;
      this.dialog = true;
    },

    customFilter(item, queryText, itemText) {
      const textOne = item.name.toLowerCase();
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1;
    },

    removeFromCart(p, index) {
      this.cart.splice(index, 1);
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
    },

    submitOptions() {
      this.dialog = false;
    },

    afterObs(event) {
      if (event.key == "Enter") {
        let i = this.index;
        console.log(this.cart[i].aux);
        this.cart[i].aux.push(this.moreOption);
        this.moreOption = "";
        this.arrDialogOptions = this.cart[i].aux;
      }
    },

    afterselection(item) {
      item.aux = [];
      this.cart.unshift(item);
      this.$nextTick(() => {
        this.aux = null;
        this.$refs.qtd.focus();
      });
    },

    afterselectionPrice(event) {
      if (event.key == "Enter") {
        this.dialog = true;

        setTimeout(() => {
          this.obj = this.cart[0];
          this.$refs.obs.focus();
        }, 200);
      }
    },

    fazerAlgumaCoisa() {
      console.log("Oi");
    },

    saveObservation() {
      this.cart[0].aux = this.aux;
      this.dialog = false;
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
        filtered = this.products.filter(
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
