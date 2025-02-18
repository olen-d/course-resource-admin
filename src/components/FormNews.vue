<script setup>
import { computed, onMounted, ref } from 'vue'

import { useStore } from 'vuex'

import { NAlert, NButton, NForm, NResult } from 'naive-ui'

import InputBrief from '@/components/form-fields/InputBrief.vue'
import InputContent from '@/components/form-fields/InputContent.vue'
import InputDateTime from '@/components/form-fields/InputDateTime.vue'
import InputTitle from '@/components/form-fields/InputTitle.vue'
import SwitchIsPublished from '@/components/form-fields/SwitchIsPublished.vue'

const props = defineProps({
  formAction: {
    type: String,
    required: true
  },
  storyId: {
    type: String,
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
const futureDate = ref('')
const isLoading = ref(true)
const resultDescription = ref('')
const showErrorMessageBox = ref(false)
const showResult = ref(false)
const storyInformation = ref({})
const submitState = { isSubmitted: false }

const publishOnISO = computed(() => {
  if (storyInformation.value.publishOn) {
    const dateObj = new Date(storyInformation.value.publishOn)
    const dateISO = dateObj.toISOString()
    return dateISO
  }
})

const expiresOnISO = computed(() => {
  if (storyInformation.value.expiresOn) {
    const dateObj = new Date(storyInformation.value.expiresOn)
    const dateISO = dateObj.toISOString()
    return dateISO
  } else {
    const futureTimestamp = getFutureTimestamp(60, 'd')
    const futureDateObj = new Date(futureTimestamp)
    const futureDateISO = futureDateObj.toISOString()
    return futureDateISO
  }
})

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
    const paramsId = props.formAction === 'new' ? '' : `/${props.storyId}`

    if (props.formAction === 'new'){
      resultDescription.value = 'Your new story has been created'
    } else if (props.formAction === 'edit') {
      resultDescription.value = 'The news story has been updated'
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/news/story${paramsId}`, {
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

const getFormErrorsChanged = () => {
  const formErrorsChanged = formValues.value.filter(element => {
    return element.isChanged !== false && element.isValid === false
  })
  return formErrorsChanged
}

const getFutureTimestamp = (increment, unit) => {
  return timeFactor(unit) * increment + Date.now()
}

const timeFactor = unit => {
  switch (unit) {
    case 'd':
      return 24 * 60 * 60 * 1000
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

const updateFormErrors = formErrors => {
  if (formErrors.length > 0) {
    const errorMessages = formErrors.map(element => {
      return element.errorMessage
    })
    errorDescription.value = errorMessages.join('. ') + '.'

    const numberAgreement = formErrors.length === 1 ? 'An Error' : 'Errors'
    errorTitle.value = `The Edit News Form Has ${numberAgreement}`

    showErrorMessageBox.value = true
  } else {
    showErrorMessageBox.value = false
    errorDescription.value = ''
    errorTitle.value = ''
  }
}

onMounted(async () => {
  if (props.formAction === 'new') {
    actionLabel.value = 'New'
    isLoading.value = false
  } else if (props.formAction === 'edit') {
    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/news/story/${props.storyId}`,
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
      isLoading.value = false
      storyInformation.value = data[0]
    }
  }
})

</script>

<template>
  <div class="about-item-form">
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
        error-message="Please enter a valid headline"
        input-name="headline"
        labeltext="Headline"
        placeholder="Enter a headline..."
        :initial-value="storyInformation.headline"
        :required="true"
        @change-form-values="updateFormValues($event)"
      />
      <InputBrief
        placeholder="Enter a summary of the story..."
        :initial-value="storyInformation.brief"
        :required="true"
        @change-form-values="updateFormValues($event)"
      />
      <InputContent
        error-message="Please enter valid article content"
        input-name="article"
        labeltext="Article"
        placeholder="Enter the news article..."
        :initial-value="storyInformation.article"
        :required="true"
        @change-form-values="updateFormValues($event)"
      />
      <InputDateTime
        error-message="Please enter a valid publication date and time"
        input-name="publishOn"
        :initial-value="publishOnISO"
        @change-form-values="updateFormValues($event)"
      />
      <InputDateTime
        error-message="Please enter a valid expiration date and time"
        input-name="expiresOn"
        labeltext="Expires On"
        :initial-value="expiresOnISO"
        @change-form-values="updateFormValues($event)"
      />
      <SwitchIsPublished
        :initial-value="storyInformation.isPublished"
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
