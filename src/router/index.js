import Vue from 'vue'
import VueRouter from 'vue-router'
import Balcao from '../views/Balcao.vue'
import Entrega from '../views/Entrega.vue'
import Products from '../views/Products.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/countertop',
    name: 'Balcao',
    component: Balcao
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/orders',
    name: 'Entrega',
    component: Entrega
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
