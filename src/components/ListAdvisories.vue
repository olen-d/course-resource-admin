<script setup>
import { computed, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import {
  NAlert,
  NButton,
  NCard,
  NGrid,
  NGridItem,
  NModal
} from 'naive-ui'

const accessToken = computed(() => store.state.accessToken)
const advisories = ref([])
const advisoryIdToDelete = ref(null)
const deleteAdvisoryResultMessage = ref(null)
const deleteAdvisoryResultTitle = ref(null)
const deleteAdvisoryResultType = ref(null)
const isLoading = ref(false)
const modalDeleteContent = ref(null)
const modalDeleteTitle = ref(null)
const showDeleteAdvisoryResult = ref(false)
const showModalDelete = ref(false)

const router = useRouter()
const store = useStore()

onMounted(async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/advisories/all`,
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
    advisories.value = data
    isLoading.value = false
  }
})

const cancelDeleteAdvisory = () => {
  showModalDelete.value = false
  modalDeleteContent.value = ""
  modalDeleteTitle.value = ""
  advisoryIdToDelete.value = ""
}

const deleteAdvisory = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/advisories/advisory/${advisoryIdToDelete.value}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    const result = await response.json()
    const { status } = response

    if (status === 200) {
      const { data: { value: { _id, facility, from, to }, ok }, } = result
      if (ok === 1) {
        deleteAdvisoryResultMessage.value = `The advisory for ${facility} ${to ? 'from' : 'at' }${' ' + from}${to ? ' to ' : ''}${to ? to : ''} was successfully deleted.`
        deleteAdvisoryResultTitle.value = "Great Success"
        deleteAdvisoryResultType.value = "success"
        showDeleteAdvisoryResult.value = true

        const index = advisories.value.findIndex(item => item._id === _id)
        advisories.value.splice(index, 1)

        setTimeout(() => { showDeleteAdvisoryResult.value = false }, 5000)
      } else {
        deleteAdvisoryResultMessage.value = `The advisory was not deleted.`
        deleteAdvisoryResultTitle.value = "Database Error"
        deleteAdvisoryResultType.value = "error"
        showDeleteAdvisoryResult.value = true

        setTimeout(() => { showDeleteAdvisoryResult.value = false }, 7500)
      }
    } else {
      deleteAdvisoryResultMessage.value = `The advisory was not deleted. Error code: ${status}`
      deleteAdvisoryResultTitle.value = "Epic Fail"
      deleteAdvisoryResultType.value = "error"
      showDeleteAdvisoryResult.value = true

      setTimeout(() => { showDeleteAdvisoryResult.value = false }, 7500)
    }
}

const handleDeleteAdvisory = event => {
  const { _id, facility, from, to } = event
  advisoryIdToDelete.value = _id
  modalDeleteContent.value = `Are you sure you want to delete the advisory for \"${facility} ${to ? 'from' : 'at' }${' ' + from}${to ? ' to ' : ''}${to ? to : ''}\"?`
  modalDeleteTitle.value = `Delete \"${facility}\"`
  showModalDelete.value = true
}

const handleEdit = _id => {
  router.push({ name: 'AdminAdvisoriesEdit', query: { id: _id } })
}

</script>

<template>
  <div class="list-advisories">
    <n-alert
      v-if="showDeleteAdvisoryResult"
      :closable="true"
      :title="deleteAdvisoryResultTitle"
      :type="deleteAdvisoryResultType"
      style="margin-bottom: 0.5rem"
    >
      {{ deleteAdvisoryResultMessage }}
    </n-alert>
    <n-modal
      v-model:show="showModalDelete"
      preset="dialog"
      type="warning"
      :content="modalDeleteContent"
      :title="modalDeleteTitle"
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="deleteAdvisory"
      @negative-click="cancelDeleteAdvisory"
    />
    <n-grid x-gap="24" y-gap="24" :cols="12" :item-responsive="true" responsive="screen">
      <n-grid-item span="xs:12 s:6 m:4 xl:3" v-for="{ _id, facility, from, to, condition, startDate, endDate, coursesAffectedLeftJoin } in advisories" :key="_id">
        <n-card>
          <template #header>
            {{ facility }}
            {{ to ? ' from ' : 'at' }}
            {{ from  }}
            {{ to && ' to ' }}
            {{ to }}
          </template>
          <template #default>
            {{ condition }}
            <div class="list-advisory-card-list">
              <p>
                Courses Affected
              </p>
              <ul>
                <li v-for="{ _id, title } in coursesAffectedLeftJoin" :key="_id">
                  {{ title }}
                </li> 
              </ul>
            </div>
          </template>
          <template #footer>
            {{ startDate && new Intl.DateTimeFormat().format(new Date(startDate)) }}
            {{ startDate && endDate && 'to' }}
            {{ endDate && new Intl.DateTimeFormat().format(new Date(endDate)) }}
          </template>
          <template #action>
            <n-button
              type="primary"
              attr-type="submit"
              @click="handleEdit(_id)"
            >
              Edit
            </n-button>
            <n-button
              type="secondary"
              attr-type="submit"
              @click="handleDeleteAdvisory({_id, facility, from, to})"
            >
              Delete
            </n-button>
          </template>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
.list-advisory-card-list {
  text-align: left;
}
.list-advisory-card-list p {
  padding-top: 2rem;
  font-weight: 700;
}
.list-advisory-card-list ul, p {
  margin-left: 0px;
  padding-left: 0.5rem;
}
.list-advisory-card-list ul li {
  display: inline;
}

.list-advisory-card-list li +li:before {
  content: ", "
}

.list-advisory-card-list li:last-child:after {
  content: ". "
}
</style>