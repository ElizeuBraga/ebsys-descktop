<template>
<div>
    <v-text-field label="Solo" v-model="email" placeholder="Placeholder" solo></v-text-field>
    <v-text-field label="Solo" v-model="password" placeholder="Placeholder" solo></v-text-field>
        <v-btn align="end" cols="6" sm="12" md="4" @click="login">Entrar</v-btn>
</div>
</template>
<script>
// @ is an alias to /src
import bcrypt from "bcrypt";

export default {
  name: "Login",
  components: {},
  data() {
    return {
        email: '',
        password: '',
    }
  },

  methods:{
    login(){
      let vm = this;
      bcrypt.compare(vm.password, '$2b$10$xMbh1KwaxeD2gmW7szuFTe.U6Jm7S3F2qQ3Mpquk56WIG2rylgzve', function(err, result) {
        (result) ? vm.$router.push('/countertop') : alert('Acesso negado!')
      });
    },
  }
};
</script>

<style scoped>
  
</style>