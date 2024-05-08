<script setup>
import { computed, h, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import {NButton, NDataTable } from 'naive-ui'

const store = useStore()

const users = ref([])

const accessToken = computed(() => store.state.accessToken)

const createColumns = ({ edit }) => {
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
        }
      ]
    }

const columns = createColumns({
  edit (row) {
    const { key } = row
    router.push({ name: 'AdminUserEdit', params: { userId: key } })
  }
})

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
    <h1>Users</h1>
    <div class="admin-users-table">
      <n-data-table
        :columns="columns"
        :data="users"
      />
    </div>
  </div>
</template>
