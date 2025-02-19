<script setup>
import FormWelcome from '@/components/FormWelcome.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="admin-welcome-items-edit">
    <FormWelcome
      form-action="edit"
      form-name="Edit Welcome Item"
      submit-action-label="Update Welcome Item"
      success-action="updated"
      :itemId="route.query.id"
    />
  </div>
</template>
