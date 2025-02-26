<script setup>
import { computed, h, ref } from 'vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { useDifficulty } from '@/composables/useDifficulty.js'

import { NAlert, NButton, NDataTable, NModal } from 'naive-ui'

const router = useRouter()
const store = useStore()

const { difficultyLevels, isLoadingStatus } = useDifficulty()

const deleteLevelResultMessage = ref(null)
const deleteLevelResultTitle = ref(null)
const deleteLevelResultType = ref(null)
const levelIdToDelete = ref(null)
const modalDeleteContent = ref(null)
const modalDeleteTitle = ref(null)
const showDeleteLevelResult = ref(false)
const showModalDelete = ref(false)

const accessToken = computed(() => store.state.accessToken)

const language = 'eng'

const cancelDeleteLevel = () => {
  showModalDelete.value = false
  modalDeleteContent.value = ''
  modalDeleteTitle.value = ''
  levelIdToDelete.value = ''
}

const createColumns = ({ edit, remove }) => {
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
    },
    {
    title: null,
      key: 'remove',
      render (row) {
        return h(
          NButton,
          {
            onClick: () => remove(row)
          },
          {
            default: () => 'Delete'
          }
        )
      }
    }
  ]
}

const columns = createColumns({
  edit (row) {
    const { key } = row
    router.push({ name: 'AdminDifficultyEdit', query: { id: key } })
  },
  remove (row) {
    const { key, level } = row
    handleDeleteLevel(key, level)
  }
})

const deleteLevel = async() => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/difficulty/level/${levelIdToDelete.value}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
  const result = await response.json()
  const { status } = response

  if (status === 200) {
    const { data: { value: { _id, [language]: level }, ok }, } = result

    if (ok === 1) {
      deleteLevelResultMessage.value = `The about item \"${level}\" was successfully deleted.`
      deleteLevelResultTitle.value = "Great Success"
      deleteLevelResultType.value = "success"
      showDeleteLevelResult.value = true

      const index = difficultyLevels.value.findIndex(item => item._id === _id)
      difficultyLevels.value.splice(index, 1)

      setTimeout(() => { showDeleteLevelResult.value = false }, 5000)
    } else {
      deleteLevelResultMessage.value = `The about item was not deleted.`
      deleteLevelResultTitle.value = "Database Error"
      deleteLevelResultType.value = "error"
      showDeleteLevelResult.value = true

      setTimeout(() => { showDeleteLevelResult.value = false }, 7500)
    }
  } else {
    deleteLevelResultMessage.value = `The about item was not deleted. Error code: ${status}`
    deleteLevelResultTitle.value = "Epic Fail"
    deleteLevelResultType.value = "error"
    showDeleteLevelResult.value = true

    setTimeout(() => { showDeleteLevelResult.value = false }, 7500)
  }
}

const handleClick = () => {
  router.push({ name: 'AdminDifficultyNew', params: { formAction: 'new' } })
}

const handleDeleteLevel = (key, level) => {
  levelIdToDelete.value = key
  modalDeleteContent.value = `Are you sure you want to delete the difficulty level: \"${level}\"?`
  modalDeleteTitle.value = `Delete \"${level}\"`
  showModalDelete.value = true
}

const levels = computed(() => {
  const filtered = difficultyLevels.value.map(element => {
    return (({ _id: key, rating, [language]: level }) => ({ key, rating, level }))(element)
  })
  return filtered
})

</script>
<template>
  <div class="table-difficulty-admin">
    <n-alert
      v-if="showDeleteLevelResult"
      :closable="true"
      :title="deleteLevelResultTitle"
      :type="deleteLevelResultType"
      style="margin-bottom: 0.5rem"
    >
      {{ deleteLevelResultMessage }}
    </n-alert>
    <n-modal
      v-model:show="showModalDelete"
      preset="dialog"
      type="warning"
      :content="modalDeleteContent"
      :title="modalDeleteTitle"
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="deleteLevel"
      @negative-click="cancelDeleteLevel"
    />
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
