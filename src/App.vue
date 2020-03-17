<template>
  <v-app>
    <v-card height="100vh">
      <v-app-bar color="deep-purple" dark>
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

        <!-- <v-toolbar-title>{{pageTitle}}</v-toolbar-title> -->
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list nav dense>
          <v-list-item-group active-class="deep-purple--text text--accent-4">
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

            <v-list-item to="/products" @click="drawer = false">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Produtos</v-list-item-title>
            </v-list-item>

            <v-list-item to="" @click="logout">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sair</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <router-view></router-view>
    </v-card>
  </v-app>
</template>

<script>
import mixins from "./mixins/sqlite";
export default {
  mixins: [mixins],
  data() {
    return {
      pageTitle: "Balcão",
      drawer: false
    };
  },

  created() {},

  methods: {
    logout() {
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
