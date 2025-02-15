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
const AdminDifficultyEdit = () => import('@/components/AdminDifficultyEdit.vue')
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
const FormDifficulty = () => import('@/components/FormDifficulty.vue')
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
    meta: {
      breadcrumbs: {
        en: 'Administration'
      }
    },
    children: [
      {
        path: '/about',
        name: 'TheAdminAbout',
        component: TheAdminAbout,
        meta: { 
          breadcrumbs: {
            en: 'About'
          }
        },
        children: [
          {
            path: '',
            name: 'AdminAboutItemsList',
            component: AdminAboutItemsList
          },
          {
            path: 'edit',
            name: 'AdminAboutItemsEdit',
            component: AdminAboutItemsEdit,
            meta: {
              breadcrumbs: {
                en: 'Edit About Item'
              }
            },
          },
          {
            path: 'new',
            name: 'AdminAboutItemsNew',
            component: AdminAboutItemsNew,
            meta: {
              breadcrumbs: {
                en: 'New About Item'
              }
            },
          }
        ]
      },
      {
        path: '/advisory',
        name: 'TheAdminAdvisory',
        component: TheAdminAdvisory,
        meta: {
          breadcrumbs: {
            en: 'Advisory'
          }
        },
        children: [
          {
            path: '',
            name: 'ListAdminAdvisory',
            component: ListAdminAdvisory
          },
          {
            path: 'edit',
            name: 'AdminAdvisoriesEdit',
            props: true,
            component: AdminAdvisoriesEdit,
            meta: {
              breadcrumbs: {
                en: 'Edit Advisory'
              }
            }
          },
          {
            path: 'new',
            name: 'AdvisoryNew',
            props: true,
            component: FormAdvisory,
            meta: {
              breadcrumbs: {
                en: 'New Advisory'
              }
            }
          }
        ]
      },
      {
        path: '/courses',
        name: 'AdminCourses',
        component: AdminCourses,
        meta: {
          breadcrumbs: {
            en: 'Courses'
          }
        },
        children: [
          {
            path: '',
            name: 'AdminCoursesList',
            component: AdminCoursesList
          },
          {
            path: 'edit',
            name: 'AdminCoursesEdit',
            component: AdminCoursesEdit,
            meta: {
              breadcrumbs: {
                en: 'Edit Course'
              }
            }
          },
          {
            path: 'new',
            name: 'AdminCoursesNew',
            component: AdminCoursesNew,
            meta: {
              breadcrumbs: {
                en: 'New Course'
              }
            }
          }
        ]
      },
      {
        path: '/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: {
          breadcrumbs: {
            en: 'Dashboard'
          }
        }
      },
      {
        path: '/links',
        name: 'AdminLinks',
        component: TheAdminLinks,
        meta: {
          breadcrumbs: {
            en: 'Links'
          }
        },
        children: [
          {
            path: '',
            name: 'AdminLinksList',
            component: AdminLinksList
          },
          {
            path: 'edit',
            name: 'AdminLinksEdit',
            props: true,
            component: AdminLinksEdit,
            meta: {
              breadcrumbs: {
                en: 'Edit Link'
              }
            }
          },
          {
            path: 'new',
            name: 'AdminLinksNew',
            props: true,
            component: FormLink,
            meta: {
              breadcrumbs: {
                en: 'New Link'
              }
            }
          }
        ]
      },
      {
        path: '/difficulty',
        name: 'AdminDifficulty',
        component: TheAdminDifficulty,
        meta: {
          breadcrumbs: {
            en: 'Difficulty'
          }
        },
        children: [
          {
            path: '',
            name: 'AdminDifficultyTable',
            component: TableDifficultyAdmin
          },
          {
            path: 'edit',
            name: 'AdminDifficultyEdit',
            component: AdminDifficultyEdit,
            meta: {
              breadcrumbs: {
                en: 'Edit Difficulty Level'
              }
            },
          },
          {
            path: 'new',
            name: 'AdminDifficultyNew',
            props: true,
            component: FormDifficulty,
            meta: {
              breadcrumbs: {
                en: 'New Difficulty Level'
              }
            }
          }
        ]
      },
      {
        path: '/news',
        name: 'AdminNews',
        component: TheAdminNews,
        meta: {
          breadcrumbs: {
            en: 'News'
          }
        },
        children: [
          {
            path: '',
            name: 'AdminNewsList',
            component: AdminNewsList
          },
          {
            path: 'edit/:id',
            name: 'AdminNewsEdit',
            component: AdminNewsEdit,
            meta: {
              breadcrumbs: {
                en: 'Edit News'
              }
            }
          },
          {
            path: 'new',
            name: 'AdminNewsNew',
            component: AdminNewsNew,
            meta: {
              breadcrumbs: {
                en: 'New News'
              }
            }
          }
        ]
      },
      {
        path: '/users',
        name: 'AdminUsers',
        component: TheAdminUsers,
        meta: {
          breadcrumbs: {
            en: 'Users'
          }
        },
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
            component: AdminUsersEdit,
            meta: {
              breadcrumbs: {
                en: 'Edit User'
              }
            }
          },
          {
            path: 'new',
            name: 'AdminUsersNew',
            component: AdminUsersNew,
            meta: {
              breadcrumbs: {
                en: 'New User'
              }
            }
          }
        ]
      },
      {
        path: '/welcome',
        name: 'TheAdminWelcome',
        component: TheAdminWelcome,
        meta: {
          breadcrumbs: {
            en: 'Welcome'
          }
        },
        children: [
          {
            path: '',
            name: 'AdminWelcomeItemsList',
            component: AdminWelcomeItemsList
          },
          {
            path: 'edit/:slug',
            name: 'AdminWelcomeItemsEdit',
            component: AdminWelcomeItemsEdit,
            meta: {
              breadcrumbs: {
                en: 'Edit Welcome Item'
              }
            }
          },
          {
            path: 'new',
            name: 'AdminWelcomeItemsNew',
            component: AdminWelcomeItemsNew,
            meta: {
              breadcrumbs: {
                en: 'New Welcome Item'
              }
            }
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
