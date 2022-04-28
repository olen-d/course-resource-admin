<script>
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { NButton, NDataTable } from 'naive-ui'

export default defineComponent({
  components: { NButton, NDataTable },
  setup () {
    const aboutItems = ref([])
    const accessToken = computed(() => store.state.accessToken)
    const router = useRouter()
    const store = useStore()

    const createColumns = ({ edit }) => {
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
        }
      ]
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
          return (({ slug: key, content, order, title }) => ({ key, content, order, title }))(element)
        })
        aboutItems.value.push(...filtered)
      }
    })

    const handleClick = () => {
      router.push({ name: 'AdminAboutItemsNew' })
    }

    return {
      columns: createColumns({
        edit (row) {
          const { key } = row
          router.push({ name: 'AdminAboutItemsEdit', params: { slug: key } })
        }
      }),
      aboutItems,
      handleClick
    }
  }
})
</script>

<template>
  <div class="admin-about-items-list">
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
