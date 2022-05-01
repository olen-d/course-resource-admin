<script setup>
import FormWelcomeItemEdit from '@/components/FormWelcomeItemEdit.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="admin-welcome-items-edit">
    <h3>Edit Welcome Item</h3>
    <FormWelcomeItemEdit :slug="route.params.slug" />
  </div>
</template>
