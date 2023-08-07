<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { NAlert, NButton, NForm, NResult } from 'naive-ui'

import { verifyBearerToken } from '@/services/jsonwebtoken.mjs'

import InputNumber from '@/components/form-fields/InputNumber.vue'
import InputAlphanumeric from '@/components/form-fields/InputAlphaNumeric.vue'

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
    const data = { creatorId, ownerId: creatorId } // TODO: If creating a new level, set creatorId equal to ownerId, if editing a level use the settings from the DB
    formValues.value.forEach(element => {
      const { inputName, inputValue } = element
      data[inputName] = inputValue
    })

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/difficulty`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      const { status } = response
      if (status === 201 && result.status === 'ok') {
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
    errorTitle.value = `The New Difficulty Level Form Has ${numberAgreement}`

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
  <div class="form-difficulty-new">
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
      description="Your new difficulty level has been created"
    />
    <n-form label-position="top">
      <InputNumber
        error-message="Please enter a valid difficulty rating"
        input-name="rating"
        labeltext="Difficulty Rating"
        placeholder="Enter a difficulty rating..."
        :required="true"
        @change-form-values="updateFormValues($event)"
      />
      <InputAlphanumeric
        error-message="Please enter a valid difficulty level"
        input-name="eng"
        labeltext="Difficulty Level (English)"
        placeholder="Enter a difficulty level in English..."
        :required="true"
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
