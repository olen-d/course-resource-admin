import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import Store from '@/store'

import { verifyBearerToken } from '@/services/jsonwebtoken.mjs'

const AdminAboutItemsEdit = () => import('@/components/AdminAboutItemsEdit.vue')
const AdminAboutItemsList = () => import('@/components/AdminAboutItemsList.vue')
const AdminAboutItemsNew = () => import('@/components/AdminAboutItemsNew.vue')
const AdminAdvisoriesEdit = () => import('@/components/AdminAdvisoriesEdit.vue')
const AdminCourses = () => import('@/components/AdminCourses.vue')
const AdminCoursesEdit = () => import('@/components/AdminCoursesEdit.vue')
const AdminCoursesList = () => import('@/components/AdminCoursesList.vue')
const AdminCoursesNew = () => import('@/components/AdminCoursesNew.vue')
const AdminDashboard = () => import('@/components/AdminDashboard.vue')
const AdminDifficultyNew = () => import('@/components/AdminDifficultyNew.vue')
const AdminLinksEdit = () => import('@/components/AdminLinksEdit.vue')
const AdminLinksList = () => import('@/components/AdminLinksList.vue')
const AdminNewsEdit = () => import('@/components/AdminNewsEdit.vue')
const AdminNewsList = () => import('@/components/AdminNewsList.vue')
const AdminNewsNew = () => import('@/components/AdminNewsNew.vue')
const AdminRoot = () => import('@/views/AdminRoot.vue')
const AdminUsersEdit = () => import('@/components/AdminUsersEdit.vue')
const AdminUsersList = () => import('@/components/AdminUsersList.vue')
const AdminUsersNew = () => import('@/components/AdminUsersNew.vue')
const AdminWelcomeItemsEdit = () => import('@/components/AdminWelcomeItemsEdit.vue')
const AdminWelcomeItemsList = () => import('@/components/AdminWelcomeItemsList.vue')
const AdminWelcomeItemsNew = () => import('@/components/AdminWelcomeItemsNew.vue')
const FormAdvisory = () => import('@/components/FormAdvisory.vue')
const FormLink = () => import('@/components/FormLink.vue')
const ListAdminAdvisory = () => import('@/components/ListAdminAdvisory.vue')
const TableDifficultyAdmin = () => import('@/components/TableDifficultyAdmin.vue')
const TheAdminAdvisory = () => import('@/components/TheAdminAdvisory.vue')
const TheAdminAbout = () => import('@/components/TheAdminAbout.vue')
const TheAdminDifficulty = () => import('@/components/TheAdminDifficulty.vue')
const TheAdminLinks = () => import('@/components/TheAdminLinks.vue')
const TheAdminNews = () => import('@/components/TheAdminNews.vue')
const TheAdminUsers = () => import('@/components/TheAdminUsers.vue')
const TheAdminWelcome = () => import('@/components/TheAdminWelcome.vue')

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
        path: '/advisory',
        name: 'TheAdminAdvisory',
        component: TheAdminAdvisory,
        children: [
          {
            path: '',
            name: 'ListAdminAdvisory',
            component: ListAdminAdvisory
          },
          {
            path: 'edit/:advisoryId',
            name: 'AdminAdvisoriesEdit',
            props: true,
            component: AdminAdvisoriesEdit
          },
          {
            path: 'new',
            name: 'AdvisoryNew',
            props: true,
            component: FormAdvisory
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
        path: '/links',
        name: 'AdminLinks',
        component: TheAdminLinks,
        children: [
          {
            path: '',
            name: 'AdminLinksList',
            component: AdminLinksList
          },
          {
            path: 'edit/:linkId',
            name: 'AdminLinksEdit',
            props: true,
            component: AdminLinksEdit
          },
          {
            path: 'new',
            name: 'AdminLinksNew',
            props: true,
            component: FormLink
          }
        ]
      },
      {
        path: '/difficulty',
        name: 'AdminDifficulty',
        component: TheAdminDifficulty,
        children: [
          {
            path: '',
            name: 'AdminDifficultyTable',
            component: TableDifficultyAdmin
          },
          {
            path: 'new',
            name: 'AdminDifficultyNew',
            component: AdminDifficultyNew
          }
        ]
      },
      {
        path: '/news',
        name: 'AdminNews',
        component: TheAdminNews,
        children: [
          {
            path: '',
            name: 'AdminNewsList',
            component: AdminNewsList
          },
          {
            path: 'edit/:id',
            name: 'AdminNewsEdit',
            component: AdminNewsEdit
          },
          {
            path: 'new',
            name: 'AdminNewsNew',
            component: AdminNewsNew
          }
        ]
      },
      {
        path: '/users',
        name: 'AdminUsers',
        component: TheAdminUsers,
        children: [
          {
            path: '',
            name: 'AdminUsersList',
            component: AdminUsersList
          },
          {
            path: 'edit/:userId',
            name: 'AdminUsersEdit',
            props: true,
            component: AdminUsersEdit
          },
          {
            path: 'new',
            name: 'AdminUsersNew',
            component: AdminUsersNew
          }
        ]
      },
      {
        path: '/welcome',
        name: 'TheAdminWelcome',
        component: TheAdminWelcome,
        children: [
          {
            path: '',
            name: 'AdminWelcomeItemsList',
            component: AdminWelcomeItemsList
          },
          {
            path: 'edit/:slug',
            name: 'AdminWelcomeItemsEdit',
            component: AdminWelcomeItemsEdit
          },
          {
            path: 'new',
            name: 'AdminWelcomeItemsNew',
            component: AdminWelcomeItemsNew
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
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
