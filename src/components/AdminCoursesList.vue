<template>
  <div class="admin-courses-list">
    <n-button
      type="primary"
      style="margin-bottom: 0.5rem"
      @click="handleClick"
    >
      New Course
    </n-button>
    <div class="admin-courses-table">
      <n-data-table
        :columns="columns"
        :data="courses"
      />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { NButton, NDataTable } from 'naive-ui'

export default defineComponent({
  components: { NButton, NDataTable },
  setup () {
    const courses = ref([])
    const accessToken = computed(() => store.state.accessToken)
    const router = useRouter()
    const store = useStore()

    const createColumns = ({ edit }) => {
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
        },
        {
          title: null,
          key: 'edit',
          render (row) {
            return h(
              NButton,
              {
                onClick: () => edit(row)
              },
              {
                default: () => 'Edit'
              }
            )
          }
        }
      ]
    }

    onMounted(async () => {
      const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/v1/courses/all`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      })
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
      columns: createColumns({
        edit (row) {
          const { key } = row
          router.push({ name: 'AdminCoursesEdit', params: { slug: key } })
        }
      }),
      courses,
      handleClick
    }
  }
})
</script>
