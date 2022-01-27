<template>
  <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
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
                path: '/users'
              }
            },
            {
              default: () => 'Users'
            }
          ),
        key: 'users'
      }
    ]

    return {
      activeKey: ref(null),
      menuOptions
    }
  }
})
</script>
