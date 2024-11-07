<template>
  <n-menu
    v-model:value="activeKey"
    mode="horizontal"
    :options="menuOptions"
  />
</template>

<script>
import { defineComponent, h, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { NMenu } from 'naive-ui'

export default defineComponent({
  components: { NMenu },
  setup () {
    const menuOptions = [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: '/dashboard'
              }
            },
            {
              default: () => 'Dashboard'
            }
          ),
        key: 'dashboard'
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: '/about'
              }
            },
            {
              default: () => 'About'
            }
          ),
        key: 'about'
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: '/advisory'
              }
            },
            {
              default: () => 'Advisories'
            }
          ),
        key: 'advisories'
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: '/courses'
              }
            },
            {
              default: () => 'Courses'
            }
          ),
        key: 'courses'
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: '/difficulty'
              }
            },
            {
              default: () => 'Difficulty'
            }
          ),
        key: 'difficulty'
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: '/links'
              }
            },
            {
              default: () => 'Links'
            }
          ),
        key: 'links'
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: '/news'
              }
            },
            {
              default: () => 'News'
            }
          ),
        key: 'news'
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: '/users'
              }
            },
            {
              default: () => 'Users'
            }
          ),
        key: 'users'
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: '/welcome'
              }
            },
            {
              default: () => 'Welcome'
            }
          ),
        key: 'welcome'
      }
    ]

    return {
      activeKey: ref(null),
      menuOptions
    }
  }
})
</script>
