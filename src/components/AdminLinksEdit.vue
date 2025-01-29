<script setup>
import FormLink from '@/components/FormLink.vue'

const props = defineProps({
  linkId: {
      type: String,
      required: true
    }
})
</script>

<template>
  <div class="admin-link-edit">
    <FormLink
      form-action="edit"
      form-name="Edit Link"
      submit-action-label="Update Link"
      success-action="updated"
      :link-id="linkId"/>
  </div>
</template>
