<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import { NAlert, NButton, NForm, NResult } from 'naive-ui'

import { verifyBearerToken } from '@/services/jsonwebtoken.mjs'

import InputNumber from '@/components/form-fields/InputNumber.vue'
import InputAlphanumeric from '@/components/form-fields/InputAlphaNumeric.vue'

const language = 'eng'

const props = defineProps({
  difficultyId: {
    type: String
  },
  formAction: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: false
  },
  submitActionLabel: {
    type: String,
    default: 'Submit'
  }
})

const store = useStore()

const actionLabel = ref('')
const accessPublicKey = computed(() => store.state.accessPublicKey) //c
const accessToken = computed(() => store.state.accessToken)
const difficultyInformation = ref({})
const errorDescription = ref('')
const errorTitle = ref('')
const formValues = ref([])
const isLoading = ref(false) 
const resultDescription = ref('')
const showErrorMessageBox = ref(false)
const showResult = ref(false)
const submitState = { isSubmitted: false }

const handleSubmit = async () => {
  submitState.isSubmitted = true
  const formErrors = getFormErrors()
  if (formErrors.length > 0) {
    updateFormErrors(formErrors)
  } else {
    // Submit
    const data = {}
    if (props.formAction === 'new') {
      const accessTokenResult = await verifyAccessToken()
      const { payload: { sub: creatorId } } = accessTokenResult
      data.creatorId = creatorId
      data.ownerId = creatorId

      formValues.value.forEach(element => {
        const { inputName, inputValue, isChanged, isRequired } = element
        if (!isChanged && !isRequired) {
          data[inputName] = null
        } else {
          data[inputName] = inputValue
        }
      })
    } else {
      const changedFormValues = formValues.value.reduce((acc, element) => {
        if (element.isChanged) {
          const { inputName, inputValue } = element
          acc.push({ inputName, inputValue })
        }
        return acc
      }, [])

      changedFormValues.forEach(element => {
        const { inputName, inputValue } = element
        data[inputName] = inputValue
      })
    }

    const method = props.formAction === 'new' ? 'POST' : 'PATCH'
    const paramsId = props.formAction === 'new' ? '' : `/${props.difficultyId}`

    if (props.formAction === 'new'){
      resultDescription.value = 'Your new difficulty level has been created'
    } else if (props.formAction === 'edit') {
      resultDescription.value = 'The difficulty level has been updated'
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/difficulty${paramsId}`, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      const { status } = response
      if (status === 200 || status === 201 && result.status === 'ok') {
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

onMounted(async () => {
  if (props.formAction === 'new') {
    actionLabel.value = 'New'
  } else if (props.formAction === 'edit') {
    actionLabel.value = 'Update'
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/difficulty/id/${props.difficultyId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
        }
      })
      const result = await response.json()
      const { status } = result
      if (status === 'ok') {
        const { data: [difficulty] } = result
        difficultyInformation.value = difficulty
      }
    } catch (error) {
      throw new Error('Failed to fetch difficulty data')
    }
  }
})
</script>

<template>
  <div class="form-difficulty">
    <h3>
      <span style="text-transform: capitalize;">{{ formAction }}</span> Difficulty Level
    </h3>
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
      :description="resultDescription"
    />
    <n-form label-position="top">
      <InputNumber
        error-message="Please enter a valid difficulty rating"
        input-name="rating"
        labeltext="Difficulty Rating"
        placeholder="Enter a difficulty rating..."
        :initial-value="difficultyInformation.rating"
        :required="true"
        @change-form-values="updateFormValues($event)"
      />
      <InputAlphanumeric
        error-message="Please enter a valid difficulty level"
        input-name="eng"
        labeltext="Difficulty Level (English)"
        placeholder="Enter a difficulty level in English..."
        :initial-value="difficultyInformation.eng"
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
