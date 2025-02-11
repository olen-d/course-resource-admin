<script setup>
import { computed } from 'vue'

import { useRoute } from 'vue-router'

import {
  NBreadcrumb,
  NBreadcrumbItem
} from 'naive-ui'

const route = useRoute()

const language = "en"

const breadcrumbs = computed(() => {
  const paths = route.path.split('/')
  paths.shift()

  const breadcrumbs = paths.reduce((breadcrumbArray, path, idx) => {
    breadcrumbArray.push({
      path,
      to: breadcrumbArray[idx - 1]
      ? '/' + breadcrumbArray[idx -1].path + '/' + path
      : '/' + path,
      text: route.matched[idx + 1]?.meta?.breadcrumbs[language] || path
    })
    return breadcrumbArray
  }, [])
  return breadcrumbs
})

</script>
<template>
  <div class="the-breadcrumbs">
    <n-breadcrumb>
      <n-breadcrumb-item v-for="({ path, to, text }, idx) in breadcrumbs" :key="path">
        <RouterLink v-if="idx !== breadcrumbs.length - 1" :to="to">{{ text }}</RouterLink>
        <div v-else>{{ text }}</div>
      </n-breadcrumb-item>
    </n-breadcrumb>
  </div>
</template>

<style scoped>
.the-breadcrumbs {
  margin-bottom: 2rem;
  text-align: left;
}
</style>
