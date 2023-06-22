<script setup>
import { computed, onMounted, toRefs, ref } from 'vue'
import { useStore } from 'vuex'
import { NAlert, NButton, NForm, NResult } from 'naive-ui'

// import { verifyBearerToken } from '@/services/jsonwebtoken.mjs'

import InputBrief from '@/components/form-fields/InputBrief.vue'
import InputContent from '@/components/form-fields/InputContent.vue'
import InputDateTime from '@/components/form-fields/InputDateTime.vue'
import InputTitle from '@/components/form-fields/InputTitle.vue'
import SwitchIsPublished from '@/components/form-fields/SwitchIsPublished.vue'

const props = defineProps({
  storyData: {
    type: Object,
    required: true
  },
  submitActionLabel: {
    type: String,
    default: 'Submit'
  }
})

// const accessPublicKey = computed(() => store.state.accessPublicKey)
const accessToken = computed(() => store.state.accessToken)
const errorDescription = ref('')
const errorTitle = ref('')
const formValues = ref([])
const futureDate = ref('')
const submitState = { isSubmitted: false }
const showErrorMessageBox = ref(false)
const showResult = ref(false)

const {
  _id,
  // creatorId,
  // ownerId,
  // updated,
  headline,
  // slug,
  brief,
  article,
  publishOn,
  expiresOn,
  isPublished
} = toRefs(props.storyData)

const publishOnISO = computed(() => {
  const dateObj = new Date(publishOn.value)
  const dateISO = dateObj.toISOString()
  return dateISO
})

const expiresOnISO = computed(() => {
  const dateObj = new Date(expiresOn.value)
  const dateISO = dateObj.toISOString()
  return dateISO
})

const store = useStore()

const handleSubmit = async () => {
  submitState.isSubmitted = true

  const formErrors = getFormErrorsChanged()

  if (formErrors.length > 0) {
    updateFormErrors(formErrors)
  } else {
    // Submit
    const data = {}
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

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/news/story/${_id.value}`, {
        method: 'PATCH',
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

// const verifyAccessToken = async () => {
//   try {
//     const verifiedAccessToken = await verifyBearerToken(accessToken.value, accessPublicKey.value)
//     return verifiedAccessToken
//   } catch (error) {
//     return false
//   }
// }

onMounted(() => {
  const futureTimestamp = getFutureTimestamp(60, 'd')
  const futureDateObj = new Date(futureTimestamp)
  const futureDateISO = futureDateObj.toISOString()
  futureDate.value = futureDateISO
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
      description="Your news story has been updated"
    />
    <n-form label-position="top">
      <InputTitle
        error-message="Please enter a valid headline"
        input-name="headline"
        labeltext="Headline"
        placeholder="Enter a headline..."
        :initial-value="headline"
        :required="true"
        @change-form-values="updateFormValues($event)"
      />
      <InputBrief
        placeholder="Enter a summary of the story..."
        :initial-value="brief"
        :required="true"
        @change-form-values="updateFormValues($event)"
      />
      <InputContent
        error-message="Please enter valid article content"
        input-name="article"
        labeltext="Article"
        placeholder="Enter the news article..."
        :initial-value="article"
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
        :initial-value="isPublished"
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
