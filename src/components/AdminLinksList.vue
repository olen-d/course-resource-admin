<script>
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { NButton, NDataTable } from 'naive-ui'

export default defineComponent({
  components: { NButton, NDataTable },
  setup () {
    const links = ref([])
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
        }
      ]
    }

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

    const handleClick = () => {
      router.push({ name: 'AdminLinksNew' })
    }

    return {
      columns: createColumns({
        edit (row) {
          const { key } = row
          router.push({ name: 'AdminLinksEdit', params: { id: key } })
        }
      }),
      links,
      handleClick
    }
  }
})
</script>

<template>
  <div class="admin-links-list">
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
