<script setup>
import { computed, h } from 'vue'

import { useRouter } from 'vue-router'

import { useDifficulty } from '@/composables/useDifficulty.js'

import { NButton, NDataTable } from 'naive-ui'

const router = useRouter()

const { data, isLoadingStatus } = useDifficulty()

const createColumns = ({ edit }) => {
  return [
    {
      title: 'Rating',
      key: 'rating'
    },
    {
      title: 'Level',
      key: 'level'
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

const language = 'eng'

const handleClick = () => {
  router.push({ name: 'AdminDifficultyNew', params: { formAction: 'new' } })
}

const columns = computed(() => {
  return createColumns({
    edit (row) {
      const { key } = row
      router.push({ name: 'AdminDifficultyEdit', query: { id: key } })
    }
  })
})

const levels = computed(() => {
  const filtered = data.value.map(element => {
    return (({ _id: key, rating, [language]: level }) => ({ key, rating, level }))(element)
  })
  return filtered
})

</script>
<template>
  <div class="table-difficulty-admin">
    <n-button
      type="primary"
      style="margin-bottom: 0.5rem"
      @click="handleClick"
    >
      New Level
    </n-button>
    <div class="admin-news-table">
      <n-data-table
        :columns="columns"
        :data="levels"
        :loading="isLoadingStatus"
      />
    </div>
  </div>
</template>
