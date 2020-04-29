import Vue from 'vue'
import App from './App.vue'
import Login from './views/Login'
import vuetify from './plugins/vuetify';
import router from './router'
import mixins from './mixins/mixins';
import Countertop from './views/Balcao';

Vue.config.productionTip = false

var app = new Vue({
  vuetify,
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
