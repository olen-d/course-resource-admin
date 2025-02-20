<script setup>
import FormAbout from '@/components/FormAbout.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="admin-about-items-edit">
    <FormAbout
      form-action="edit"
      form-name="Edit About Item"
      submit-action-label="Update About Item"
      success-action="updated"
      :itemId="route.query.id"
    />
  </div>
</template>
