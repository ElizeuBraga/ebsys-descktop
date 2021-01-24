import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Vue.use(VueSimpleAlert, { reverseButtons: false });

var app = new Vue({
  // vuetify,
  // BootstrapVue,
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
