<template>
  <div class="admin-courses-new">
    <h3>New Course</h3>
    <CourseForm submitActionLabel="Create Course" />
  </div>
</template>

<script>
import CourseForm from './CourseForm.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { CourseForm }
})
</script>
