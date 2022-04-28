import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Store from '@/store'

import { verifyBearerToken } from '@/services/jsonwebtoken.mjs'

const AdminAboutItemsEdit = () => import('@/components/AdminAboutItemsEdit.vue')
const AdminAboutItemsList = () => import('@/components/AdminAboutItemsList.vue')
const AdminAboutItemsNew = () => import('@/components/AdminAboutItemsNew.vue')
const AdminCourses = () => import('@/components/AdminCourses.vue')
const AdminCoursesEdit = () => import('@/components/AdminCoursesEdit.vue')
const AdminCoursesList = () => import('@/components/AdminCoursesList.vue')
const AdminCoursesNew = () => import('@/components/AdminCoursesNew.vue')
const AdminDashboard = () => import('@/components/AdminDashboard.vue')
const AdminRoot = () => import('@/views/AdminRoot.vue')
const AdminUsers = () => import('@/components/AdminUsers.vue')
const TheAdminAbout = () => import('@/components/TheAdminAbout.vue')

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
    name: 'AdminRoot',
    component: AdminRoot,
    children: [
      {
        path: '/about',
        name: 'TheAdminAbout',
        component: TheAdminAbout,
        children: [
          {
            path: '',
            name: 'AdminAboutItemsList',
            component: AdminAboutItemsList
          },
          {
            path: 'edit/:slug',
            name: 'AdminAboutItemsEdit',
            component: AdminAboutItemsEdit
          },
          {
            path: 'new',
            name: 'AdminAboutItemsNew',
            component: AdminAboutItemsNew
          }
        ]
      },
      {
        path: '/courses',
        name: 'AdminCourses',
        component: AdminCourses,
        children: [
          {
            path: '',
            name: 'AdminCoursesList',
            component: AdminCoursesList
          },
          {
            path: 'edit/:slug',
            name: 'AdminCoursesEdit',
            component: AdminCoursesEdit
          },
          {
            path: 'new',
            name: 'AdminCoursesNew',
            component: AdminCoursesNew
          }
        ]
      },
      {
        path: '/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: '/users',
        name: 'AdminUsers',
        component: AdminUsers
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
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from) => {
  const isAuthenticated = await verifyAccessToken()
  if (to.name !== 'Login' && !isAuthenticated) return '/login'
})

export default router
