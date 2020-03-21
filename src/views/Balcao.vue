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
                  <th class="text-left">Qtd</th>
                  <th class="text-left">Parcial</th>
                  <th class="text-center">Opções</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in cart" :key="i">
                  <td>{{ p.name }}</td>
                  <td>{{ p.price.toFixed(2) }}</td>
                  <td>{{p.qtd}}</td>
                  <td>{{p.parcial.toFixed(2)}}</td>
                  <td align="end">
                    <v-btn class="primary" @click="removeFromCart(p,i)" rounded>Excluir</v-btn>
                    <v-btn class="primary" @click="show(p)" rounded>Ver</v-btn>
                    
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-card-actions>
            <v-row>
              <v-col>
                <v-btn class="white--text" :color="myColor" rounded>Receber</v-btn>
              </v-col>
              <v-col>
                <v-btn class="white--text" color="red" rounded>Cancelar</v-btn>
              </v-col>
              <v-col>
                <v-label align="end">{{total.toFixed(2)}}</v-label>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>

        <v-dialog v-model="dialog" width="500" persistent>
          <v-card>
            {{obj.name}}
            <v-chip
              v-for="(obs,i) in obj.arrObs"
              :key="i"
              class="ma-2"
              close
              color="teal"
              text-color="white"
              @click:close="removeObservation(i)"
              
            >{{obs}}</v-chip>
            <v-text-field
              v-model="moreOption"
              ref="obs"
              v-on:keydown="afterObs"
              placeholder="Outras Observações"
            ></v-text-field>
            <v-btn @click="insertInCart" :disabled="moreOption != ''">Ok</v-btn>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEdit" width="500" persistent>
          <v-card>
            {{obj.name}}
            <v-chip
              v-for="(obs,i) in obj.arrObs"
              :key="i"
              class="ma-2"
              close
              color="teal"
              text-color="white"
              @click:close="removeObservation(i)"
              
            >{{obs}}</v-chip>
            <v-text-field
              v-model="moreOption"
              ref="obs"
              v-on:keydown="afterObs"
              placeholder="Outras Observações"
            ></v-text-field>
            <v-btn @click="dialogEdit = false" :disabled="moreOption != ''">Ok</v-btn>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="6" sm="12" md="4">
        <v-autocomplete
          ref="seletion"
          v-model="produto"
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
      dialogEdit: false,
      obj: {},
      moreOption: "",
      selected: [],
      dialog: false,
      qtd: 1,
      options: [],
      products: [],
      produto: {},
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
    removeObservation(i){
      this.obj.arrObs.splice(i, 1)
    },

    show(p){
      this.dialogEdit = true
      this.obj = p;
    },
    
    insertInCart(){
      this.produto = {}
      this.qtd = 1
      this.obj.parcial = this.obj.qtd * this.obj.price
      this.cart.unshift(this.obj)
      this.obj = {}
      this.dialog = !this.dialog
      setTimeout(() => {
        this.$refs.seletion.focus();
        }, 200);
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

    afterObs(event) {
      if (event.key == "Enter") {
          this.obj.arrObs.push(this.moreOption)
          this.moreOption = "";
      }
    },

    afterselection(item) {
      this.obj =  Object.assign({}, item);
      this.obj.arrObs = []
      this.$nextTick(() => {
        this.$refs.qtd.focus();
      });
    },

    afterselectionPrice(event) {
      this.obj.qtd = this.qtd
      if (event.key == "Enter") {
        this.dialog = true;
        setTimeout(() => {
          this.$refs.obs.focus();
        }, 200);
      }
    },
  },

  computed: {
    total() {
      let total = 0;
      this.cart.forEach(element => {
        total += element.parcial;
      });

      return total;
    }
  }
};
</script>
