import Vue from 'vue'
import VueRouter from 'vue-router'
import Balcao from '../views/Balcao.vue'
import Entrega from '../views/Entrega.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Balcao',
    component: Balcao
  },
  {
    path: '/orders',
    name: 'Entrega',
    component: Entrega
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
