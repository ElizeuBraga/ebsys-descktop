<template>
  <v-container :style="{background:'red'}">

  </v-container>
</template>

<script>
import axios from "axios";
import mixins from '../mixins/mixins';
export default {
  mixins: [mixins],
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
    axios
        .get(this.host + "products")
        .then(response => {
          console.log(response.data)
          localStorage.setItem('products', JSON.stringify(response.data))
          this.loading = false;
        })
        .catch(e => {
          // console.log(e)
        });
  },

  methods: {
    loadProductsFromCloud() {
      return console.log(JSON.parse(localStorage.products));
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
