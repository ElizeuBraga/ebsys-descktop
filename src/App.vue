<template>
  <v-app>
      <v-app-bar :style="{background: color}">
        <v-app-bar-nav-icon v-show="logged" @click="drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title :style="{color:textColor}" v-on:logged="teste($event)">{{pageTitle}}</v-toolbar-title>
      </v-app-bar>
      <v-container fill-height fluid :style="{width:'1800px', background:''}">
      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list nav dense>
          <v-list-item-group :color="myColor">
            <v-list-item to="/orders" @click="drawer = false">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Entregas</v-list-item-title>
            </v-list-item>

            <v-list-item to="/countertop" @click="drawer = false">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Balcão</v-list-item-title>
            </v-list-item>
            <v-list-item to @click="logout">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sair</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <router-view></router-view>
      </v-container>
  </v-app>
</template>

<script>
import mixins from "./mixins/mixins";
import EventBus from "./EventBus";
import Login from "./views/Login";
export default {
  mixins: [mixins],
  components: {
    Login: Login
  },
  data() {
    return {
      pageTitle: "Skiltys FastFood",
      drawer: false
    };
  },

  created() {
    this.$root.$on('change_color', (e) =>{
      this.color = e
    })
    // Listen event logged and deslogged
    EventBus.$on('changetitle', (payLoad) =>{
      this.pageTitle = payLoad
    });
    EventBus.$on("logged", (payLoad) => {
      if(payLoad){
        this.logged = true;
      }else{
        this.logged = false;
        this.pageTitle = 'Ebsys'
      }
    });
  },

  methods: {
    logout() {
      EventBus.$emit("logged", false);
      this.$router.push("/");
    },
    returnPageTitle(e) {
      this.pageTitle = e;
      this.drawer = false;
    }
  }
};
</script>
<style lang="scss">
</style>
