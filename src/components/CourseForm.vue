<template>
  <div class="course-form">
    <n-alert v-if="showErrorMessageBox"
      :title="errorTitle"
      type="error"
      :description="errorDescription"
      :show-icon="true"
      style="margin-bottom: 1.5rem; text-align: left"
    >
    </n-alert>
    <n-form label-position="top">
    </n-form>
    <n-button @click="handleSubmit" type="primary" attr-type="submit">{{submitActionLabel}}</n-button>
    <br />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

import { NAlert, NButton, NForm } from 'naive-ui'

export default defineComponent({
  components: { NAlert, NButton, NForm },
  props: {
    submitActionLabel: {
      type: String,
      default: 'Submit'
    }
  },
  setup () {
    const showErrorMessageBox = ref(false)
    const handleSubmit = async () => {
      // Check for errors
      // Show error box if fields did not pass validation
      // Otherwise submit
    }
    return {
      handleSubmit,
      showErrorMessageBox
    }
  }
})
// Inputs:
// Title
// Slug
// isPublished
// publishOn
// Length
// Ascent
// Latitude
// Longitude
// Address
// Street
// City
// State
// Country
// Postcode
// Difficulty
// Summary
// Terrain
// Setting
// Happiness
// Facts
// Parking
// Creation
// Photographs
// CourseFiles
</script>
