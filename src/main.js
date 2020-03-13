import Vue from 'vue'
import App from './App.vue'
import Login from './views/Login'
import vuetify from './plugins/vuetify';
import router from './router'

Vue.config.productionTip = false

var app = new Vue({
  vuetify,
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
