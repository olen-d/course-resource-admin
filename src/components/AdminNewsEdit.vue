<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import FormNewsEdit from '@/components/FormNewsEdit.vue'

const route = useRoute()
const store = useStore()

const { params: { id: storyId } } = route

const isLoading = ref(true)
const storyData = ref([])

onMounted(async () => {
  const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/v1/news/story/${storyId}`,
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
    isLoading.value = false
    storyData.value = data
  }
})

const accessToken = computed(() => {
  return store.state.accessToken
})
</script>

<template>
  <div
    v-if="!isLoading"
    class="admin-news-edit"
  >
    <h3>Edit News Story</h3>
    <FormNewsEdit
      submit-action-label="Update News Story"
      :story-data="storyData[0]"
    />
  </div>
</template>
