<script setup>
import FormDifficulty from '@/components/FormDifficulty.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="admin-advisories-edit">
    <FormDifficulty
      form-action="edit"
      form-name="Edit Difficulty"
      submit-action-label="Update Difficulty"
      success-action="updated"
      :difficulty-id="route.query.id"/>
  </div>
</template>
