<template>
  <div class="admin-courses-list">
    <n-button @click="handleClick" type="primary" style="margin-bottom: 0.5rem">Add New</n-button>
    <div class="admin-courses-table">
      <n-data-table :columns="columns" :data="courses" />
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NDataTable } from 'naive-ui'

const createColumns = () => {
  return [
    {
      title: 'Title',
      key: 'title'
    },
    {
      title: 'Length',
      key: 'length'
    },
    {
      title: 'Ascent',
      key: 'ascent'
    },
    {
      title: 'Summary',
      key: 'summary'
    },
    {
      title: 'Terrain',
      key: 'terrain'
    },
    {
      title: 'Setting',
      key: 'setting'
    },
    {
      title: 'Difficulty',
      key: 'difficulty'
    },
    {
      title: 'Publish On',
      key: 'publishOn'
    }
  ]
}

export default defineComponent({
  components: { NButton, NDataTable },
  setup () {
    const courses = ref([])
    const router = useRouter()

    onMounted(async () => {
      const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/v1/courses`)
      const result = await response.json()
      const { status } = response

      if (status === 200) {
        const { data } = result
        const filtered = data.map(element => {
          return (({ slug: key, title, length, ascent, summary, terrain, setting, difficulty, publishOn }) => ({ key, title, length, ascent, summary, terrain, setting, difficulty, publishOn }))(element)
        })
        courses.value.push(...filtered)
      }
    })

    const handleClick = () => {
      router.push({ name: 'AdminCoursesNew' })
    }

    return {
      columns: createColumns(),
      courses,
      handleClick
    }
  }
})
</script>
