<script setup>
import { computed, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { NButton, NCard, NGrid, NGridItem } from 'naive-ui'

const accessToken = computed(() => store.state.accessToken)
const advisories = ref([])
const isLoading = ref(false) 
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

const handleDelete = event => {
  console.log(event)
}

const handleEdit = _id => {
  router.push({ name: 'AdminAdvisoriesEdit', params: { advisoryId: _id } })
}

</script>

<template>
  <div class="list-advisories">
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
              @click="handleDelete(_id)"
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