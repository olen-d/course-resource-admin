<template>
  <div class="navbar">
    <TheNavbarAdmin v-if="isAuthorized" />
  </div>
</template>

<script>
import TheNavbarAdmin from './TheNavbarAdmin'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  components: {
    TheNavbarAdmin
  },
  setup () {
    const store = useStore()
    const isAuthorized = computed(() => store.state.isAuthorized)

    return {
      isAuthorized
    }
  }
})
</script>
