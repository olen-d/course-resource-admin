<script setup>
import { computed, onMounted, ref } from 'vue'

import { useStore } from 'vuex'

import { NAlert, NButton, NForm, NResult } from 'naive-ui'

import InputContent from '@/components/form-fields/InputContent.vue'
import InputOrder from '@/components/form-fields/InputOrder.vue'
import InputTitle from '@/components/form-fields/InputTitle.vue'
import SwitchIsPublished from '@/components/form-fields/SwitchIsPublished.vue'

const props = defineProps({
  formAction: {
    type: String,
    required: true
  },
  itemId: {
    type: String
  },
  submitActionLabel: {
    type: String,
    default: 'Submit'
  }
})

const store = useStore()

const accessToken = computed(() => store.state.accessToken)
const actionLabel = ref('')
const errorDescription = ref('')
const errorTitle = ref('')
const formValues = ref([])
const isLoading = ref(true)
const resultDescription = ref('')
const showErrorMessageBox = ref(false)
const showResult = ref(false)
const submitState = { isSubmitted: false }
const welcomeItemInformation = ref({})

const getFormErrorsChanged = () => {
  const formErrorsChanged = formValues.value.filter(element => {
    return element.isChanged !== false && element.isValid === false
  })
  return formErrorsChanged
}

const handleSubmit = async () => {
  submitState.isSubmitted = true
  const formErrors = getFormErrorsChanged()

  if (formErrors.length > 0) {
    updateFormErrors(formErrors)
  } else {
    // Submit
    const data = {}
    if (props.formAction === 'new') {
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
    const paramsId = props.formAction === 'new' ? '' : `/${props.itemId}`

    if (props.formAction === 'new'){
      resultDescription.value = 'Your new welcome item has been created'
    } else if (props.formAction === 'edit') {
      resultDescription.value = 'The welcome item has been updated'
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/welcome/item${paramsId}`, {
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

const updateFormErrors = formErrors => {
  if (formErrors.length > 0) {
    const errorMessages = formErrors.map(element => {
      return element.errorMessage
    })
    errorDescription.value = errorMessages.join('. ') + '.'

    const numberAgreement = formErrors.length === 1 ? 'An Error' : 'Errors'
    errorTitle.value = `The Welcome Item Edit Form Has ${numberAgreement}`

    showErrorMessageBox.value = true
  } else {
    showErrorMessageBox.value = false
    errorDescription.value = ''
    errorTitle.value = ''
  }
}

const updateFormValues = event => {
  const { inputName: name } = event
  const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
  if (valuesIndex === -1) {
    formValues.value.push(event)
  } else {
    formValues.value[valuesIndex] = event
  }
  const formErrors = getFormErrorsChanged()
  updateFormErrors(formErrors)
}

onMounted(async () => {
  if (props.formAction === 'new') {
    actionLabel.value = 'New'
    isLoading.value = false
  } else if (props.formAction === 'edit') {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/v1/welcome/item/all/id/${props.itemId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      })
    const result = await response.json()
    const { status } = response

    if (status === 200) {
      const { data } = result
      welcomeItemInformation.value = data[0]
      isLoading.value = false
    }
  }
})

</script>

<template>
  <div class="form-welcome-item-edit">
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
      <InputTitle
        v-if="!isLoading"
        :initial-value="welcomeItemInformation.title"
        @change-form-values="updateFormValues($event)"
      />
      <InputContent
        v-if="!isLoading"
        :initial-value="welcomeItemInformation.content"
        @change-form-values="updateFormValues($event)"
      />
      <InputOrder
        v-if="!isLoading"
        :initial-value="welcomeItemInformation.order"
        @change-form-values="updateFormValues($event)"
      />
      <SwitchIsPublished
        v-if="!isLoading"
        :initial-value="welcomeItemInformation.isPublished"
        @change-form-values="updateFormValues($event)"
      />
      <n-button
        type="primary"
        attr-type="submit"
        @click="handleSubmit"
      >
        {{ submitActionLabel }}
      </n-button>
    </n-form>
  </div>
</template>
