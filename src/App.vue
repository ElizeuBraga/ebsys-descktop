<template>
<v-card height="100vh">
  <v-app-bar
      color="deep-purple"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <!-- <v-toolbar-title>{{pageTitle}}</v-toolbar-title> -->
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item v-if="location == '/'"  to="/orders" @click="location = '/orders'">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Entregas</v-list-item-title>
          </v-list-item>

          <v-list-item v-else to="/balcao" @click="location = '/'">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Balcão</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  <router-view></router-view>
</v-card>
</template>

<script>
export default {
  data() {
    return {
      pageTitle: "Balcão",
      drawer:false,
      location: '/'
    }
  },

  computed:{
    
  },
    methods:{
      returnPageTitle(e){
        this.pageTitle = e
        this.drawer = false
      }
    }
}
</script>
<style lang="scss">

</style>
