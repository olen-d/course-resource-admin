<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { NAlert, NButton, NForm, NResult } from 'naive-ui'

import { verifyBearerToken } from '@/services/jsonwebtoken.mjs'

import InputAddress from '@/components/form-fields/InputAddress.vue'
import InputAscent from '@/components//form-fields/InputAscent.vue'
import InputBrief from '@/components/form-fields/InputBrief.vue'
import InputCity from '@/components/form-fields/InputCity.vue'
import InputCountry from '@/components/form-fields/InputCountry.vue'
import InputCreation from '@/components/form-fields/InputCreation.vue'
import InputDateTime from '@/components/form-fields/InputDateTime.vue'
import InputDogStatistics from '@/components/form-fields/InputDogStatistics.vue'
import InputFacts from '@/components/form-fields/InputFacts.vue'
import InputLatitude from '@/components/form-fields/InputLatitude.vue'
import InputLength from '@/components/form-fields/InputLength.vue'
import InputLongitude from '@/components/form-fields/InputLongitude.vue'
import InputParking from '@/components/form-fields/InputParking.vue'
import InputPostcode from '@/components/form-fields/InputPostcode.vue'
import InputRideWithGPSURI from '@/components/form-fields/InputRideWithGPSURI.vue'
import InputState from '@/components/form-fields/InputState.vue'
import InputSummary from '@/components/form-fields/InputSummary.vue'
import InputTitle from '@/components/form-fields/InputTitle.vue'
import RateHappiness from '@/components/form-fields/RateHappiness.vue'
import SelectDifficulty from '@/components/form-fields/SelectDifficulty.vue'
import SelectSetting from '@/components/form-fields/SelectSetting.vue'
import SelectTerrain from '@/components/form-fields/SelectTerrain.vue'
import SwitchIsPublished from '@/components/form-fields/SwitchIsPublished.vue'
import TheUploadFilesCourse from '@/components/TheUploadFilesCourse.vue'
import TheUploadFilesImage from '@/components/TheUploadFilesImage.vue'

const props = defineProps({
  submitActionLabel: {
    type: String,
    default: 'Submit'
  }
})

const accessPublicKey = computed(() => store.state.accessPublicKey)
const accessToken = computed(() => store.state.accessToken)
const errorDescription = ref('')
const errorTitle = ref('')
const formValues = ref([])
const submitState = { isSubmitted: false }
const showErrorMessageBox = ref(false)
const showResult = ref(false)
const store = useStore()

const handleSubmit = async () => {
  submitState.isSubmitted = true
  const formErrors = getFormErrors()
  if (formErrors.length > 0) {
    updateFormErrors(formErrors)
  } else {
    // Submit
    const accessTokenResult = await verifyAccessToken()
    const { payload: { sub: creatorId } } = accessTokenResult
    const data = { creatorId, ownerId: creatorId } // TODO: If creating a new course, set creatorId equal to ownerId, if editing a course use the settings from the DB
    formValues.value.forEach(element => {
      const { inputName, inputValue } = element
      data[inputName] = inputValue
    })

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/courses/course`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      const { status } = response

      if (status === 200 && result.status === 'ok') {
        showResult.value = true
      }
      // TODO: Finish the error handling to address all cases
      if (status === 400 && result.message) {
        errorDescription.value = 'One or more required fields were not submitted ot the server. Please try again in a few minutes.'
        errorTitle.value = 'Server Error'
        showErrorMessageBox.value = true
      }
    } catch (error) {
      console.log(error)
    }
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

const verifyAccessToken = async () => {
  try {
    const verifiedAccessToken = await verifyBearerToken(accessToken.value, accessPublicKey.value)
    return verifiedAccessToken
  } catch (error) {
    return false
  }
}
</script>

<template>
  <div class="course-form">
    <n-alert
      v-if="showErrorMessageBox"
      :title="errorTitle"
      type="error"
      :show-icon="true"
      style="margin-bottom: 1.5rem; text-align: left"
    >
      {{ errorDescription }}
    </n-alert>
    <n-result
      v-if="showResult"
      status="success"
      title="Great Success"
      description="Your new course has been created"
    />
    <n-form label-position="top">
      <InputTitle @change-form-values="updateFormValues($event)" />
      <InputLength @change-form-values="updateFormValues($event)" />
      <InputAscent @change-form-values="updateFormValues($event)" />
      <InputLatitude @change-form-values="updateFormValues($event)" />
      <InputLongitude @change-form-values="updateFormValues($event)" />
      <InputAddress @change-form-values="updateFormValues($event)" />
      <InputCity @change-form-values="updateFormValues($event)" />
      <InputState @change-form-values="updateFormValues($event)" />
      <InputCountry @change-form-values="updateFormValues($event)" />
      <InputPostcode @change-form-values="updateFormValues($event)" />
      <SelectDifficulty @change-form-values="updateFormValues($event)" />
      <InputBrief @change-form-values="updateFormValues($event)" />
      <InputSummary @change-form-values="updateFormValues($event)" />
      <SelectTerrain @change-form-values="updateFormValues($event)" />
      <SelectSetting @change-form-values="updateFormValues($event)" />
      <RateHappiness @change-form-values="updateFormValues($event)" />
      <InputFacts @change-form-values="updateFormValues($event)" />
      <InputParking @change-form-values="updateFormValues($event)" />
      <InputCreation @change-form-values="updateFormValues($event)" />
      <TheUploadFilesCourse @change-form-values="updateFormValues($event)" />
      <TheUploadFilesImage @change-form-values="updateFormValues($event)" />
      <InputDateTime
        input-name="publishOn"
        @change-form-values="updateFormValues($event)"
      />
      <SwitchIsPublished @change-form-values="updateFormValues($event)" />
      <InputRideWithGPSURI @change-form-values="updateFormValues($event)" />
      <InputDogStatistics
        input-name="totalChases"
        labeltext="Dog Chases"
        @change-form-values="updateFormValues($event)"
      />
      <InputDogStatistics
        input-name="totalDogs"
        labeltext="Total Dogs"
        @change-form-values="updateFormValues($event)"
      />
      <InputDogStatistics
        input-name="totalLegs"
        labeltext="Total Legs"
        @change-form-values="updateFormValues($event)"
      />
      <n-button
        type="primary"
        attr-type="submit"
        @click="handleSubmit"
      >
        {{ props.submitActionLabel }}
      </n-button>
    </n-form>
  </div>
</template>
