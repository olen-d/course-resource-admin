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
    name: 'AdminWrapper',
    component: AdminRoot,
    children: [
      {
        path: '/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      }
    ]
  },
  {
    path: '/login',
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from) => {
  const isAuthenticated = await verifyAccessToken()
  if (to.name !== 'Login' && !isAuthenticated) return '/login'
})

export default router
