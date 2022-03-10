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
    <n-result v-if="showResult"
      status="success"
      title="Great Success"
      description="Your new course has been created"
    >
    </n-result>
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
      <InputFacts @changeFormValues="updateFormValues($event)" />
      <InputParking @changeFormValues="updateFormValues($event)" />
      <InputCreation @changeFormValues="updateFormValues($event)" />
      <TheUploadFilesCourse @changeFormValues="updateFormValues($event)" />
      <TheUploadFilesImage @changeFormValues="updateFormValues($event)" />
      <InputDateTime inputName="publishOn" @changeFormValues="updateFormValues($event)" />
      <SwitchIsPublished @changeFormValues="updateFormValues($event)" />
      <InputRideWithGPSURI @changeFormValues="updateFormValues($event)" />
      <n-button @click="handleSubmit" type="primary" attr-type="submit">{{submitActionLabel}}</n-button>
    </n-form>
  </div>
</template>

<script>
import InputAddress from './form-fields/InputAddress.vue'
import InputAscent from './form-fields/InputAscent.vue'
import InputCity from './form-fields/InputCity.vue'
import InputCountry from './form-fields/InputCountry.vue'
import InputCreation from './form-fields/InputCreation.vue'
import InputDateTime from './form-fields/InputDateTime.vue'
import InputFacts from './form-fields/InputFacts.vue'
import InputLatitude from './form-fields/InputLatitude.vue'
import InputLength from './form-fields/InputLength.vue'
import InputLongitude from './form-fields/InputLongitude.vue'
import InputParking from './form-fields/InputParking.vue'
import InputPostcode from './form-fields/InputPostcode.vue'
import InputRideWithGPSURI from './form-fields/InputRideWithGPSURI.vue'
import InputState from './form-fields/InputState.vue'
import InputSummary from './form-fields/InputSummary.vue'
import InputTitle from './form-fields/InputTitle.vue'
import RateHappiness from './form-fields/RateHappiness.vue'
import SelectDifficulty from './form-fields/SelectDifficulty.vue'
import SelectSetting from './form-fields/SelectSetting.vue'
import SelectTerrain from './form-fields/SelectTerrain.vue'
import SwitchIsPublished from './form-fields/SwitchIsPublished.vue'
import TheUploadFilesCourse from './TheUploadFilesCourse.vue'
import TheUploadFilesImage from './TheUploadFilesImage.vue'

import { computed, defineComponent, ref } from 'vue'

import { useStore } from 'vuex'

import { verifyBearerToken } from '../services/jsonwebtoken.mjs'

import { NAlert, NButton, NForm, NResult } from 'naive-ui'

export default defineComponent({
  components: {
    InputAddress,
    InputAscent,
    InputCity,
    InputCountry,
    InputCreation,
    InputDateTime,
    InputFacts,
    InputLatitude,
    InputLength,
    InputLongitude,
    InputParking,
    InputPostcode,
    InputRideWithGPSURI,
    InputState,
    InputSummary,
    InputTitle,
    NAlert,
    NButton,
    NForm,
    NResult,
    RateHappiness,
    SelectDifficulty,
    SelectSetting,
    SelectTerrain,
    SwitchIsPublished,
    TheUploadFilesCourse,
    TheUploadFilesImage
  },
  props: {
    submitActionLabel: {
      type: String,
      default: 'Submit'
    }
  },
  setup () {
    const store = useStore()
    const accessPublicKey = computed(() => store.state.accessPublicKey)
    const accessToken = computed(() => store.state.accessToken)
    const errorDescription = ref('')
    const errorTitle = ref('')
    const formValues = ref([])
    const submitState = { isSubmitted: false }
    const showErrorMessageBox = ref(false)
    const showResult = ref(false)

    const handleSubmit = async () => {
      submitState.isSubmitted = true
      const formErrors = getFormErrors()
      if (formErrors.length > 0) {
        updateFormErrors(formErrors)
      } else {
        // Submit
        const accessTokenResult = await verifyAccessToken()
        const { sub: creatorId } = accessTokenResult
        const data = { creatorId, ownerId: creatorId } // TODO: If creating a new course, set creatorId equal to ownerId, if editing a course use the settings from the DB
        formValues.value.forEach(element => {
          const { inputName, inputValue } = element
          data[inputName] = inputValue
        })

        try {
          const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/v1/courses/course`, {
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

    return {
      errorDescription,
      errorTitle,
      formValues,
      handleSubmit,
      showErrorMessageBox,
      showResult,
      updateFormValues
    }
  }
})
</script>
