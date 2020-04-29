<template>
          <v-row justify="center">
              <v-col cols="10">
                <v-progress-linear indeterminate :color="myColor" v-show="isLoading"></v-progress-linear>
              </v-col>
              <v-alert
                transition="scale-transition"
                width="80%"
                v-show="alert.active"
                dense
                outlined
                :type="alert.type"
              >{{alert.message}}</v-alert>
              <v-col cols="10" v-show="isCad" >
                <v-text-field
                  label="Nome"
                  v-model="userData.name"
                  :rounded="true"
                  :disabled="loading"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  label="Email"
                  v-model="userData.email"
                  :rounded="true"
                  :disabled="loading"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="10" v-show="isCad" >
                <v-text-field
                  label="Telefone"
                  v-model="userData.phone"
                  :rounded="true"
                  :disabled="loading"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="10" v-show="isCad" >
                <v-text-field
                  label="Telefone"
                  v-model="userData.phone"
                  :rounded="true"
                  :disabled="loading"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  :rounded="true"
                  type="password"
                  label="Password"
                  v-model="userData.password"
                  :disabled="loading"
                  solo
                ></v-text-field>
              </v-col>
              <v-col v-show="isCad" cols="10">
                <v-text-field
                  :rounded="true"
                  type="password"
                  label="Password"
                  v-model="userData.password"
                  :disabled="loading"
                  solo
                ></v-text-field>
              </v-col>
            </v-row>
</template>

  <script>
// @ is an alias to /src
import mixins from "./../mixins/mixins";
import EventBus from "../EventBus";
import bcrypt from "bcryptjs";
import axios from "axios";
import EbForm from './../components/EbForm';

export default {
  props:{
    userData: Object,
    isCad:Boolean,
    isLoading:Boolean,
    alert:Object
  },
  mixins: [mixins],
  components: {
    EbForm
  },
  name: "Login",
  data() {
    return {
      loading: false,
      name:"",
      phone:"",
      password_confirmation: "",
    };
  },

  mounted() {},

  computed: {
     
    checkInputs() {
      return this.email == "" || this.password == "";
    },

    checkStore() {
      return Object.keys(this.store).length === 0;
    }
  },

  methods: {
    
  }
};
</script>
