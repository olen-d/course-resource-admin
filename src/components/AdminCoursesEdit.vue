<script setup>
import FormCourseEdit from './FormCourseEdit.vue'

import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// const slugData = ref()

onMounted(
  () => {
    //
  }
// console.log('Mounted')
// slugData.value = route.params.slug
// console.log('mounted', route.params.slug)
// () => route.params.slug,
// async newSlug => {
//   slugData.value = newSlug
// }
)

// watch(
//   () => route.params.slug,
//   async newSlug => {
//     slugData.value = newSlug
//   }
// )
</script>

<template>
  <div class="admin-courses-edit">
    <h3>Edit Course</h3>
    <FormCourseEdit :slug="route.params.slug" />
  </div>
</template>
