<template>
  <div class="course-form">
    <n-alert v-if="showErrorMessageBox"
      :title="errorTitle"
      type="error"
      :show-icon="true"
      style="margin-bottom: 1.5rem; text-align: left"
    >
      {{errorDescription}}
    </n-alert>
    <n-form label-position="top">
    </n-form>
    <InputTitle @changeFormValues="updateFormValues($event)" />
    <InputLength @changeFormValues="updateFormValues($event)" />
    <n-button @click="handleSubmit" type="primary" attr-type="submit">{{submitActionLabel}}</n-button>
    {{formValues.title}}
    <br />
  </div>
</template>

<script>
import InputLength from './form-fields/InputLength.vue'
import InputTitle from './form-fields/InputTitle.vue'

import { defineComponent, ref } from 'vue'

import { NAlert, NButton, NForm } from 'naive-ui'

export default defineComponent({
  components: { InputLength, InputTitle, NAlert, NButton, NForm },
  props: {
    submitActionLabel: {
      type: String,
      default: 'Submit'
    }
  },
  setup () {
    const errorDescription = ref('')
    const errorTitle = ref('')
    const formValues = ref([])
    const showErrorMessageBox = ref(false)

    const handleSubmit = async () => {
      const formErrors = getFormErrors()

      if (formErrors.length > 0) {
        const errorMessages = formErrors.map(element => {
          return element.errorMessage
        })
        errorDescription.value = errorMessages.join('. ') + '.'

        const numberAgreement = formErrors.length === 1 ? 'An Error' : 'Errors'
        errorTitle.value = `The New Course Form Has ${numberAgreement}`

        showErrorMessageBox.value = true
      } else {
        showErrorMessageBox.value = false
      // Otherwise submit
      }
    }

    const getFormErrors = () => {
      const formErrors = formValues.value.filter(element => {
        return element.isValid === false
      })
      return formErrors
      // const errorsIndex = formValues.value.findIndex(element => element.isValid === false)
      // return errorsIndex !== -1
    }

    const updateFormValues = event => {
      const { inputName: name } = event
      const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
      if (valuesIndex === -1) {
        formValues.value.push(event)
      } else {
        formValues.value[valuesIndex] = event
      }
      // if (showErrorMessageBox.value) { validateForm() }
      // TODO: Check formErrors for true, if found, disable the submit button, otherwise enable the submit button
    }
    return {
      errorDescription,
      errorTitle,
      formValues,
      handleSubmit,
      showErrorMessageBox,
      updateFormValues
    }
  }
})
// Inputs:
// x Title
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
