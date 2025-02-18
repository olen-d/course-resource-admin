<script setup>
import { computed, h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { NAlert, NButton, NDataTable, NModal } from 'naive-ui'

const router = useRouter()
const store = useStore()

const deleteUserResultMessage = ref(null)
const deleteUserResultTitle = ref(null)
const deleteUserResultType = ref(null)
const showDeleteUserResult = ref(false)
const showModalDelete = ref(false)
const modalDeleteContent = ref(null)
const modalDeleteTitle = ref(null)
const userIdToDelete = ref(null)
const users = ref([])

const accessToken = computed(() => store.state.accessToken)

const cancelDeleteUser = () => {
  showModalDelete.value = false
  modalDeleteContent.value = ""
  modalDeleteTitle.value = ""
  userIdToDelete.value = ""
}

const createColumns = ({ edit, remove }) => {
  return [
    {
      title: 'First Name',
      key: 'firstName'
    },
    {
      title: 'Last Name',
      key: 'lastName'
    },
    {
      title: 'Username',
      key: 'username'
    },
    {
      title: 'Role',
      key: 'role'
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
    router.push({ name: 'AdminUsersEdit', query: { id: key } })
  },

  remove (row) {
    const { key, username } = row
    handleDeleteUser(key, username)
  }
})

const deleteUser = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/users/id/${userIdToDelete.value}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    const result = await response.json()
    const { status } = response

    if (status === 200) {
      const { data: { value: { _id, firstName, lastName, username }, ok }, } = result
      if (ok === 1) {
        deleteUserResultMessage.value = `The user ${firstName} ${lastName} (${username}) was successfully deleted.`
        deleteUserResultTitle.value = "Great Success"
        deleteUserResultType.value = "success"
        showDeleteUserResult.value = true

        const index = users.value.findIndex(item => item.key === _id)
        users.value.splice(index, 1)

        setTimeout(() => { showDeleteUserResult.value = false }, 5000)
      } else {
        deleteUserResultMessage.value = `The user was not deleted.`
        deleteUserResultTitle.value = "Database Error"
        deleteUserResultType.value = "error"
        showDeleteUserResult.value = true

        setTimeout(() => { showDeleteUserResult.value = false }, 7500)
      }
    } else {
      deleteUserResultMessage.value = `The user was not deleted. Error code: ${status}`
      deleteUserResultTitle.value = "Epic Fail"
      deleteUserResultType.value = "error"
      showDeleteUserResult.value = true

      setTimeout(() => { showDeleteUserResult.value = false }, 7500)
    }
  }

const handleClick = () => {
  router.push({ name: 'AdminUsersNew' })
}

const handleDeleteUser = (userid, username) => {
  userIdToDelete.value = userid
  modalDeleteContent.value = `Are you sure you want to delete the user \"${username}\"?`
  modalDeleteTitle.value = `Delete \"${username}\"`
  showModalDelete.value = true
}

onMounted(async () => {
  const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/v1/users`,
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
      return (({ _id: key, firstName, lastName, role, username }) => ({ key, firstName, lastName, role, username }))(element)
    })
    users.value.push(...filtered)
  }
})
  
</script>
<template>
  <div class="admin-users">
    <n-alert
      v-if="showDeleteUserResult"
      :closable="true"
      :title="deleteUserResultTitle"
      :type="deleteUserResultType"
      style="margin-bottom: 0.5rem"
    >
      {{ deleteUserResultMessage }}
    </n-alert>
    <n-modal
      v-model:show="showModalDelete"
      preset="dialog"
      type="warning"
      :content="modalDeleteContent"
      :title="modalDeleteTitle"
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="deleteUser"
      @negative-click="cancelDeleteUser"
    />
    <n-button
      type="primary"
      style="margin-bottom: 0.5rem"
      @click="handleClick"
    >
      New User
    </n-button>
    <div class="admin-users-table">
      <n-data-table
        :columns="columns"
        :data="users"
      />
    </div>
  </div>
</template>
