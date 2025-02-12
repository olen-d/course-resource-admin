<script setup>
import FormAdvisory from '@/components/FormAdvisory.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="admin-advisories-edit">
    <FormAdvisory
      form-action="edit"
      form-name="Edit Advisory"
      submit-action-label="Update Advisory"
      success-action="updated"
      :advisory-id="route.query.id"/>
  </div>
</template>
