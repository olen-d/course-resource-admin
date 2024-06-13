<script setup>
import FormUserUpsert from '@/components/FormUserUpsert.vue'

const props = defineProps({
  userId: {
      type: String,
      required: true
    }
})
</script>

<template>
  <div class="admin-users-edit">
    <h3>Edit User</h3>
    <FormUserUpsert
      form-action="edit"
      form-name="Edit User"
      submit-action-label="Update User"
      success-action="updated"
      :user-id="userId"/>
  </div>
</template>
