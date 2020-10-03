<template>
  <v-app>
    <v-app-bar :style="{background: mainColor}">
      <v-app-bar-nav-icon v-show="logged" @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title :style="{color:textColor}" v-on:logged="teste($event)">{{pageTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-toolbar-title :style="{color:textColor}" v-bind="attrs" v-on="on">{{loggedUser.name}}</v-toolbar-title>
          <!-- <v-btn class="purple" color="primary" dark v-bind="attrs" v-on="on">Slide Y Transition</v-btn> -->
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in items" :key="i" @click="clickedItem(item)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-container fill-height fluid :style="{width:'1800px', background:backgroundColor}">
      <v-progress-linear
      v-if="loading"
      indeterminate
      :color="mainColor"
    ></v-progress-linear>
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
import {User} from './models/User';
export default {
  mixins: [mixins],
  components: {
    Login: Login
  },
  data() {
    return {
      items: [{ title: "Trocar senha" }, {title: 'Atualizar'}, { title: "Sair"}],
      loggedUser: {},
      pageTitle: "Skiltys FastFood",
      drawer: false,
      loading: true,
    };
  },

  created() {
    this.$root.$on("change_color", e => {
      this.mainColor = e;
    });

    this.$root.$on("loading", e => {
      this.loading = e
    });

    this.$root.$on("logged_user", e => {
      this.loggedUser = e;
    });
    // Listen event logged and deslogged
    EventBus.$on("changetitle", payLoad => {
      this.pageTitle = payLoad;
    });
    EventBus.$on("logged", payLoad => {
      if (payLoad) {
        this.logged = true;
      } else {
        this.logged = false;
        this.pageTitle = "Ebsys";
      }
    });
  },

  methods: {
    logout() {
      this.$root.$emit("logout", true);
    },

    clickedItem(item){
      if (item.title === 'Sair') {
        this.logout()
      }

      if (item.title === 'Atualizar') {
        this.$root.$emit("update_products", true);
      }
      
      if (item.title === 'Trocar senha') {
        this.$fire({
          title:"Deseja mudar sua senha?",
          text:"Será necessário realizar login novamente para completar esta ação",
          type:"question",
          showCloseButton: true,
          showCancelButton: true,
        }).then((r)=>{
          if(r.value === true){
            let user = new User()
            user.resetPassword(this.loggedUser.id)
            this.logout()
          }
        })
      }
    },
    returnPageTitle(e) {
      this.pageTitle = e;
      this.drawer = false;
    }
  }
};
</script>
<style lang="scss">
.v-application {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
</style>
