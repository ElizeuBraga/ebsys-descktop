<template>
  <v-app>
      <v-app-bar :style="{background: mainColor}">
        <v-app-bar-nav-icon v-show="logged" @click="drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title :style="{color:textColor}" v-on:logged="teste($event)">{{pageTitle}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title :style="{color:textColor}" @click="logout">{{loggedUser.name}}</v-toolbar-title>
      </v-app-bar>
      <v-container fill-height fluid :style="{width:'1800px', background:backgroundColor}">
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
      loggedUser: {},
      pageTitle: "Skiltys FastFood",
      drawer: false
    };
  },

  created() {
    this.$root.$on('change_color', (e) =>{
      this.mainColor = e
    })

    this.$root.$on('logged_user', (e) =>{
      this.loggedUser = e
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
      this.$root.$emit("logout", true);
    },
    returnPageTitle(e) {
      this.pageTitle = e;
      this.drawer = false;
    }
  }
};
</script>
<style lang="scss">
  .v-application{
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }
</style>
