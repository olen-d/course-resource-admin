<script setup>
import { computed, h, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { NAlert, NButton, NDataTable, NModal } from 'naive-ui'

const router = useRouter()
const store = useStore()

const aboutItems = ref([])
const deleteItemResultMessage = ref(null)
const deleteItemResultTitle = ref(null)
const deleteItemResultType = ref(null)
const itemIdToDelete = ref(null)
const modalDeleteContent = ref(null)
const modalDeleteTitle = ref(null)
const showDeleteItemResult = ref(false)
const showModalDelete = ref(false)

const accessToken = computed(() => store.state.accessToken)

const cancelDeleteItem = () => {
  showModalDelete.value = false
  modalDeleteContent.value = ''
  modalDeleteTitle.value = ''
  itemIdToDelete.value = ''
}

const createColumns = ({ edit, remove }) => {
  return [
    {
      title: 'Order',
      key: 'order'
    },
    {
      title: 'Title',
      key: 'title'
    },
    {
      title: 'Content',
      key: 'content'
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
    router.push({ name: 'AdminAboutItemsEdit', query: { id: key } })
  },
  remove (row) {
    const { key, title } = row
    handleDeleteItem(key, title)
  }
})

const deleteItem = async() => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/about/item/${itemIdToDelete.value}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    const result = await response.json()
    const { status } = response

    if (status === 200) {
      const { data: { value: { _id, title }, ok }, } = result

      if (ok === 1) {
        deleteItemResultMessage.value = `The about item \"${title}\"" was successfully deleted.`
        deleteItemResultTitle.value = "Great Success"
        deleteItemResultType.value = "success"
        showDeleteItemResult.value = true

        const index = aboutItems.value.findIndex(item => item.key === _id)
        aboutItems.value.splice(index, 1)

        setTimeout(() => { showDeleteItemResult.value = false }, 5000)
      } else {
        deleteItemResultMessage.value = `The about item was not deleted.`
        deleteItemResultTitle.value = "Database Error"
        deleteItemResultType.value = "error"
        showDeleteItemResult.value = true

        setTimeout(() => { showDeleteItemResult.value = false }, 7500)
      }
    } else {
      deleteItemResultMessage.value = `The about item was not deleted. Error code: ${status}`
      deleteItemResultTitle.value = "Epic Fail"
      deleteItemResultType.value = "error"
      showDeleteItemResult.value = true

      setTimeout(() => { showDeleteItemResult.value = false }, 7500)
    }
}

const handleClick = () => {
  router.push({ name: 'AdminAboutItemsNew', params: { formAction: 'new' } })
}

const handleDeleteItem = (key, title) => {
  itemIdToDelete.value = key
  modalDeleteContent.value = `Are you sure you want to delete the about item: \"${title}\"?`
  modalDeleteTitle.value = `Delete \"${title}\"`
  showModalDelete.value = true
}

onMounted(async () => {
  const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/v1/about/items/all`,
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
      return (({ _id: key, content, order, title }) => ({ key, content, order, title }))(element)
    })
    aboutItems.value.push(...filtered)
  }
})

</script>

<template>
  <div class="admin-about-items-list">
    <n-alert
      v-if="showDeleteItemResult"
      :closable="true"
      :title="deleteItemResultTitle"
      :type="deleteItemResultType"
      style="margin-bottom: 0.5rem"
    >
      {{ deleteItemResultMessage }}
    </n-alert>
    <n-modal
      v-model:show="showModalDelete"
      preset="dialog"
      type="warning"
      :content="modalDeleteContent"
      :title="modalDeleteTitle"
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="deleteItem"
      @negative-click="cancelDeleteItem"
    />
    <n-button
      type="primary"
      style="margin-bottom: 0.5rem"
      @click="handleClick"
    >
      New About Item
    </n-button>
    <div class="admin-about-items-table">
      <n-data-table
        :columns="columns"
        :data="aboutItems"
      />
    </div>
  </div>
</template>
