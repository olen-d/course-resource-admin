<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import { NAlert, NButton, NForm, NResult } from 'naive-ui'

import InputAnchor from '@/components/form-fields/InputAnchor.vue'
import InputDescription from '@/components/form-fields/InputDescription.vue'
import InputIcon from '@/components/form-fields/InputIcon.vue'
import InputOrder from '@/components/form-fields/InputOrder.vue'
import InputURI from '@/components/form-fields/InputURI.vue'
import SelectCategory from '@/components/form-fields/SelectCategory.vue' // Update to Select Generic and cancel Select Category
import SwitchIsPublished from '@/components/form-fields/SwitchIsPublished.vue'

const props = defineProps({
  formAction: {
    type: String,
    required: true
  },
  linkId: {
    type: String,
  },
  submitActionLabel: {
    type: String,
    default: 'Submit'
  }
})

const accessToken = computed(() => store.state.accessToken)
const actionLabel = ref('')
const errorDescription = ref('')
const errorTitle = ref('')
const formValues = ref([])
const isLoading = ref(true)
const linkInformation = ref({})
const resultDescription = ref('')
const showErrorMessageBox = ref(false)
const showResult = ref(false)
const store = useStore()
const submitState = { isSubmitted: false }

onMounted(async () => {
  if (props.formAction === 'new') {
    actionLabel.value = 'New'
    isLoading.value = false
  } else if (props.formAction === 'edit') {
    actionLabel.value = 'Update'
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/links/all/${props.linkId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
        }
      })
      const result = await response.json()
      const { status } = result
      if (status === 'ok') {
        const { data: [link] } = result
        linkInformation.value = link
        isLoading.value = false
      }
    } catch (error) {
      throw new Error('Failed to fetch advisory data')
    }
  }
})

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
    const paramsId = props.formAction === 'new' ? '' : `/${props.linkId}`

    if (props.formAction === 'new'){
      resultDescription.value = 'Your new link has been created'
    } else if (props.formAction === 'edit') {
      resultDescription.value = 'The link has been updated'
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/links/link${paramsId}`, {
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
    errorTitle.value = `The ${actionLabel.value} Link Form Has ${numberAgreement}`

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
</script>

<template>
  <div class="form-link">
    <h3>
      <span style="text-transform: capitalize;">{{ formAction }}</span> Link
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
      <InputAnchor
        v-if="!isLoading"
        :initial-value="linkInformation.anchor"
        @change-form-values="updateFormValues($event)"
      />
      <InputURI
        v-if="!isLoading"
        :initial-value="linkInformation.uri"
        @change-form-values="updateFormValues($event)"
      />
      <InputIcon
        v-if="!isLoading"
        :initial-value="linkInformation.icon"
        @change-form-values="updateFormValues($event)"
      />
      <InputDescription
        v-if="!isLoading"
        :initial-value="linkInformation.description"
        @change-form-values="updateFormValues($event)"
      />
      <SelectCategory
        v-if="!isLoading"
        :initial-value="linkInformation.category"
        @change-form-values="updateFormValues($event)"
      />
      <InputOrder
        v-if="!isLoading"
        :initial-value="linkInformation.order"
        @change-form-values="updateFormValues($event)"
      />
      <SwitchIsPublished
        v-if="!isLoading"
        :initial-value="linkInformation.isPublished"
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
