<script setup>
import { computed, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import { useStore } from 'vuex'

import { useAnalytics } from '@/composables/useAnalytics.js'

import { formatTimeMicroseconds } from '@/libraries/dates.js'

import {
  NAlert,
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NGrid,
  NGridItem,
  NModal
} from 'naive-ui'

import CustomTile from '@/components/CustomTile.vue'

const router = useRouter()

const store = useStore()

const accessToken = computed(() => store.state.accessToken)

const props = defineProps({
  limit: {
    type: Number,
    default: 5
  }
})

const courseIdToDelete = ref(null)
const courses = ref([])
const isLoading = ref(true)
const modalDeleteContent = ref(null)
const modalDeleteTitle = ref(null)
const showModalDelete = ref(false)
const statistics = ref({})

const cancelDeleteCourse = () => {
  showModalDelete.value = false
  modalDeleteContent.value = ''
  modalDeleteTitle.value = ''
  courseIdToDelete.value = ''
}

const handleClickDelete = (_id, title) => {
  // Check and see if role is allowed to delete...
  courseIdToDelete.value = _id
  modalDeleteContent.value = `Are you sure you want to delete the course \"${title}\"?`
  modalDeleteTitle.value = `Delete \"${title}\"`
  showModalDelete.value = true
  // deleteCourse(_id)
}

// TODO: Update across the app to use _id instead of slug
const handleClickEdit = _id => {
  router.push({ name: 'AdminCoursesEdit', query: { id: _id } })
}

const deleteCourse = _id => {
  // Delete the course
}

onMounted(async () => {
  const queryString = props.limit > 0 ? `?limit=${props.limit}` : ''

  try {
    const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/courses/all${queryString}`,
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
    courses.value = data
    isLoading.value = false
    for (const element of data) {
      const { slug } = element
      const route = `/courses/${slug}`
      const routeEncoded = encodeURIComponent(route)
      const { data: { averageTime, entryPageCount, exitPageCount, totalViews }, isLoading } = await useAnalytics(`pages/route/summary?route=${routeEncoded}`)
      if (!isLoading) { statistics.value[slug] = { averageTime, entryPageCount, exitPageCount, totalViews } }
    }
  }
  } catch (error) {
    throw new Error (`Fetch Courses All Epic Fail ${error}`)
  }
})

</script>

<template>
  <div class="list-courses-and-statistics">
    <n-modal
      v-model:show="showModalDelete"
      preset="dialog"
      type="error"
      :content="modalDeleteContent"
      :title="modalDeleteTitle"
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="deleteCourse"
      @negative-click="cancelDeleteCourse"
    />
    <n-grid
      x-gap="24"
      y-gap="24"
      :cols="12"
      :item-responsive="true"
      responsive="screen"
    >
      <n-grid-item
        span="xs:12 xl:6"
        v-for="{ _id, title, slug, brief, length, ascent, terrain, setting, difficultyLevel } in courses" :key="_id"
      >
        <CustomTile>
          <template #header>
            <div class="header-title">
              {{ title }}
            </div>
            <div class="header-button">
              <n-button
                type="primary"
                style="margin-bottom: 0.5rem"
                @click="handleClickEdit(_id)"
              >
                Edit
              </n-button>
            </div>
            <div class="header-button">
              <n-button
                type="default"
                style="margin-bottom: 0.5rem"
                @click="handleClickDelete(_id, title)"
              >
                Delete
              </n-button>
            </div>
          </template>
          <template #meta>
            <div class="meta-item">
              <span class="meta-description">Length</span><br />
              <span class="meta-value">{{ length }}</span>
              mi
            </div>
            <div class="meta-item">
              <span class="meta-description">Ascent</span><br />
              <span class="meta-value">{{ ascent }}</span>
              ft
            </div>
            <div class="meta-item">
              <span class="meta-description">Terrain</span><br />
              <span class="meta-value-text">{{ terrain }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-description">Setting</span><br />
              <span class="meta-value-text">{{ setting }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-description">Difficulty</span><br />
              <span class="meta-value-text">{{ difficultyLevel[0].eng }}</span>
            </div>
          </template>
          <template #content>
            {{ brief }}
          </template>
          <template #statistics>
            <div class="meta-item">
              <span class="meta-description">Views</span><br />
              <span class="meta-value">{{ statistics[slug]?.totalViews }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-description">Average Time</span><br />
              <span class="meta-value">{{ formatTimeMicroseconds(statistics[slug]?.averageTime, 'elapsedTime') }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-description">Entries</span><br />
              <span class="meta-value">{{ statistics[slug]?.entryPageCount }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-description">Exits</span><br />
              <span class="meta-value">{{ statistics[slug]?.exitPageCount }}</span>
            </div>
          </template>
        </CustomTile>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
.header-button {
  align-self: flex-end;
  margin-left: 2rem;
}
.header-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #777;
  flex:1;
}
.meta-description {
  text-transform: uppercase;
}
.meta-item {
  margin-right: 2rem;
  color: #999;
}
.meta-value {
  font-size: 1.2rem;
  font-weight: 700;
}
.meta-value-text {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: capitalize;
}
</style>
