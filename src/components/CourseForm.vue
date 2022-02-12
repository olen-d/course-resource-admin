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
      <InputTitle @changeFormValues="updateFormValues($event)" />
      <InputLength @changeFormValues="updateFormValues($event)" />
      <InputAscent @changeFormValues="updateFormValues($event)" />
      <InputLatitude @changeFormValues="updateFormValues($event)" />
      <InputLongitude @changeFormValues="updateFormValues($event)" />
      <InputAddress @changeFormValues="updateFormValues($event)" />
      <InputCity @changeFormValues="updateFormValues($event)" />
      <InputState @changeFormValues="updateFormValues($event)" />
      <InputCountry @changeFormValues="updateFormValues($event)" />
      <InputPostcode @changeFormValues="updateFormValues($event)" />
      <SelectDifficulty @changeFormValues="updateFormValues($event)" />
      <InputSummary @changeFormValues="updateFormValues($event)" />
      <SelectTerrain @changeFormValues="updateFormValues($event)" />
      <SelectSetting @changeFormValues="updateFormValues($event)" />
      <RateHappiness @changeFormValues="updateFormValues($event)" />
      <n-button @click="handleSubmit" type="primary" attr-type="submit">{{submitActionLabel}}</n-button>
    </n-form>
  </div>
</template>

<script>
import InputAddress from './form-fields/InputAddress.vue'
import InputAscent from './form-fields/InputAscent.vue'
import InputCity from './form-fields/InputCity.vue'
import InputCountry from './form-fields/InputCountry.vue'
import InputLatitude from './form-fields/InputLatitude.vue'
import InputLength from './form-fields/InputLength.vue'
import InputLongitude from './form-fields/InputLongitude.vue'
import InputPostcode from './form-fields/InputPostcode.vue'
import InputState from './form-fields/InputState.vue'
import InputSummary from './form-fields/InputSummary.vue'
import InputTitle from './form-fields/InputTitle.vue'
import RateHappiness from './form-fields/RateHappiness.vue'
import SelectDifficulty from './form-fields/SelectDifficulty.vue'
import SelectSetting from './form-fields/SelectSetting.vue'
import SelectTerrain from './form-fields/SelectTerrain.vue'

import { defineComponent, ref } from 'vue'

import { NAlert, NButton, NForm } from 'naive-ui'

export default defineComponent({
  components: {
    InputAddress,
    InputAscent,
    InputCity,
    InputCountry,
    InputLatitude,
    InputLength,
    InputLongitude,
    InputPostcode,
    InputState,
    InputSummary,
    InputTitle,
    NAlert,
    NButton,
    NForm,
    RateHappiness,
    SelectDifficulty,
    SelectSetting,
    SelectTerrain
  },
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
    const submitState = { isSubmitted: false }
    const showErrorMessageBox = ref(false)

    const handleSubmit = async () => {
      submitState.isSubmitted = true
      const formErrors = getFormErrors()
      if (formErrors.length > 0) {
        updateFormErrors(formErrors)
      } else {
        // TODO: Submit
      }
    }

    const getFormErrors = () => {
      const formErrors = formValues.value.filter(element => {
        return element.isValid === false
      })
      return formErrors
    }

    const getFormErrorsChanged = () => {
      const formErrorsChanged = formValues.value.filter(element => {
        return element.isChanged !== false && element.isValid === false
      })
      return formErrorsChanged
    }

    const updateFormValues = event => {
      const { inputName: name } = event
      const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
      if (valuesIndex === -1) {
        formValues.value.push(event)
      } else {
        formValues.value[valuesIndex] = event
      }
      const formErrors = submitState.isSubmitted ? getFormErrors() : getFormErrorsChanged()
      updateFormErrors(formErrors)
    }

    const updateFormErrors = formErrors => {
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
        errorDescription.value = ''
        errorTitle.value = ''
      }
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
// x Length
// x Ascent
// x Latitude
// x Longitude
// x Address
// x City
// x State
// x Country
// x Postcode
// x Difficulty
// x Summary
// x Terrain
// x Setting
// Happiness
// Facts
// Parking
// Creation
// Photographs
// CourseFiles
</script>
