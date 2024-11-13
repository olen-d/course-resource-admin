<script setup>
import FormAdvisory from '@/components/FormAdvisory.vue'

const props = defineProps({
  advisoryId: {
      type: String,
      required: true
    }
})
</script>

<template>
  <div class="admin-advisories-edit">
    <FormAdvisory
      form-action="edit"
      form-name="Edit Advisory"
      submit-action-label="Update Advisory"
      success-action="updated"
      :advisory-id="advisoryId"/>
  </div>
</template>
