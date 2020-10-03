import Vue from 'vue'
import App from './App.vue'
import Login from './views/Login'
import vuetify from './plugins/vuetify';
import router from './router'
import mixins from './mixins/mixins';
import Countertop from './views/Balcao';
import VueSimpleAlert from "vue-simple-alert";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
var server = require("./server");

Vue.config.productionTip = false
Vue.use(require('vue-shortkey'))
Vue.use(VueSimpleAlert, { reverseButtons: false });

var app = new Vue({
  vuetify,
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
