<script setup>
import { useRoute } from 'vue-router'

import FormUserUpsert from '@/components/FormUserUpsert.vue'

const route = useRoute()
</script>

<template>
  <div class="admin-users-edit">
    <h3>Edit User</h3>
    <FormUserUpsert
      form-action="edit"
      form-name="Edit User"
      submit-action-label="Update User"
      success-action="updated"
      :user-id="route.query.id"/>
  </div>
</template>
