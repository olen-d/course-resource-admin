<script>
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { NButton, NDataTable } from 'naive-ui'

export default defineComponent({
  components: { NButton, NDataTable },
  setup () {
    const stories = ref([])
    const accessToken = computed(() => store.state.accessToken)
    const router = useRouter()
    const store = useStore()

    const createColumns = ({ edit }) => {
      return [
        {
          title: 'Headline',
          key: 'headline'
        },
        {
          title: 'Brief',
          key: 'brief'
        },
        {
          title: 'Publish On',
          key: 'publishOn'
        },
        {
          title: 'Expires On',
          key: 'expiresOn'
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

    const formatDate = timestamp => {
      const dateToFormat = new Date(timestamp)
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }
      const dateFormatted = new Intl.DateTimeFormat('en-US', options).format(dateToFormat)
      return dateFormatted
    }

    onMounted(async () => {
      const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/v1/news/all`,
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
          return (({ _id: key, brief, expiresOn, headline, publishOn }) => ({ key, brief, expiresOn: formatDate(expiresOn), headline, publishOn: formatDate(publishOn) }))(element)
        })
        stories.value.push(...filtered)
      }
    })

    const handleClick = () => {
      router.push({ name: 'AdminNewsNew' })
    }

    return {
      columns: createColumns({
        edit (row) {
          const { key } = row
          router.push({ name: 'AdminNewsEdit', params: { id: key } })
        }
      }),
      stories,
      handleClick
    }
  }
})
</script>

<template>
  <div class="admin-news-list">
    <n-button
      type="primary"
      style="margin-bottom: 0.5rem"
      @click="handleClick"
    >
      New Story
    </n-button>
    <div class="admin-news-table">
      <n-data-table
        :columns="columns"
        :data="stories"
      />
    </div>
  </div>
</template>
