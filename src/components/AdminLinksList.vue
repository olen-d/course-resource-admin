<script setup>
import { computed, h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { NAlert, NButton, NDataTable, NModal } from 'naive-ui'

const router = useRouter()
const store = useStore()

const deleteLinkResultMessage = ref(null)
const deleteLinkResultTitle = ref(null)
const deleteLinkResultType = ref(null)
const linkIdToDelete = ref(null)
const links = ref([])
const modalDeleteContent = ref(null)
const modalDeleteTitle = ref(null)
const showDeleteLinkResult = ref(false)
const showModalDelete = ref(false)

const accessToken = computed(() => store.state.accessToken)

const cancelDeleteLink = () => {
  showModalDelete.value = false
  modalDeleteContent.value = ''
  modalDeleteTitle.value = ''
  linkIdToDelete.value = ''
}

const createColumns = ({ edit, remove }) => {
  return [
    {
      title: 'Order',
      key: 'order'
    },
    {
      title: 'Anchor',
      key: 'anchor'
    },
    {
      title: 'URI',
      key: 'uri'
    },
    {
      title: 'Description',
      key: 'description'
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

const deleteLink = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/links/link/${linkIdToDelete.value}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
  const result = await response.json()
  const { status } = response

  if (status === 200 && result?.data?.lastErrorObject?.n === 1) {
    const { data: { value: { _id, anchor }, ok }, } = result
    if (ok === 1) {
      deleteLinkResultMessage.value = `The link \"${anchor}\" was successfully deleted.`
      deleteLinkResultTitle.value = "Great Success"
      deleteLinkResultType.value = "success"
      showDeleteLinkResult.value = true

      const index = links.value.findIndex(item => item.key === _id)
      links.value.splice(index, 1)

      setTimeout(() => { showDeleteLinkResult.value = false }, 5000)
    } else {
      deleteLinkResultMessage.value = `The link was not deleted.`
      deleteLinkResultTitle.value = "Database Error"
      deleteLinkResultType.value = "error"
      showDeleteLinkResult.value = true

      setTimeout(() => { showDeleteLinkResult.value = false }, 7500)
    }
  } else {
    deleteLinkResultMessage.value = `The link was not deleted. Error code: ${status}`
    deleteLinkResultTitle.value = "Epic Fail"
    deleteLinkResultType.value = "error"
    showDeleteLinkResult.value = true

    setTimeout(() => { showDeleteLinkResult.value = false }, 7500)
  }
}

const handleClick = () => {
  router.push({ name: 'AdminLinksNew', params: { formAction: 'new' } })
}

const handleDeleteLink = (key, anchor) => {
  linkIdToDelete.value = key
  modalDeleteContent.value = `Are you sure you want to delete the link: \"${anchor}\"?`
  modalDeleteTitle.value = `Delete \"${anchor}\"`
  showModalDelete.value = true
}

const columns = createColumns({
  edit (row) {
    const { key } = row
    router.push({ name: 'AdminLinksEdit', query: { id: key } })
  },
  remove (row) {
    const { key, anchor } = row
    handleDeleteLink(key, anchor)
  }
})

onMounted(async () => {
  const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/v1/links/all`,
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
      return (({ _id: key, anchor, description, order, uri }) => ({ key, anchor, description, order, uri }))(element)
    })
    links.value.push(...filtered)
  }
})
</script>

<template>
  <div class="admin-links-list">
    <n-alert
      v-if="showDeleteLinkResult"
      :closable="true"
      :title="deleteLinkResultTitle"
      :type="deleteLinkResultType"
      style="margin-bottom: 0.5rem"
    >
      {{ deleteLinkResultMessage }}
    </n-alert>
    <n-modal
      v-model:show="showModalDelete"
      preset="dialog"
      type="warning"
      :content="modalDeleteContent"
      :title="modalDeleteTitle"
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="deleteLink"
      @negative-click="cancelDeleteLink"
    />
    <n-button
      type="primary"
      style="margin-bottom: 0.5rem"
      @click="handleClick"
    >
      New Link
    </n-button>
    <div class="admin-links-table">
      <n-data-table
        :columns="columns"
        :data="links"
      />
    </div>
  </div>
</template>
