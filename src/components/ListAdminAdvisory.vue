<script setup>
import { useRouter } from 'vue-router'

import { NButton } from 'naive-ui'

const router = useRouter()

const handleClick = () => {
  router.push({ name: 'AdvisoryNew', params: { action: 'new' } })
}
</script>

<template>
  <div class="list-admin-advisory">
    <n-button
      type="primary"
      style="margin-bottom: 0.5rem"
      @click="handleClick"
    >
      New Course Advisory
    </n-button>
  </div>
</template>