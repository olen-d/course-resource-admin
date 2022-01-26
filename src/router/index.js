import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Store from '../store'

import { verifyBearerToken } from '../services/jsonwebtoken.mjs'

const AdminRoot = () => import(/* webpackChunkName: "admin" */ '../views/AdminRoot.vue')
const AdminDashboard = () => import(/* webpackChunkName: "admin" */ '../components/AdminDashboard.vue')

const verifyAccessToken = async () => {
  const { state: { accessPublicKey, accessToken } } = Store

  try {
    const verifiedAccessToken = await verifyBearerToken(accessToken, accessPublicKey)
    return verifiedAccessToken
  } catch (error) {
    return false
  }
}

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminRoot,
    beforeEnter: async (to, from) => {
      return await verifyAccessToken() ? true : { name: 'Login' }
    },
    children: [
      {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboard
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
