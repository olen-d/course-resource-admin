<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import { NAlert, NButton, NForm, NResult } from 'naive-ui'

import InputDateTime from '@/components/form-fields/InputDateTime.vue'
import InputName from '@/components/form-fields/InputName.vue'
import SelectGeneric from '@/components/form-fields/SelectGeneric.vue'
import SwitchIsPublished from '@/components/form-fields/SwitchIsPublished.vue'

const props = defineProps({
  action: {
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

const actionLabel = ref('')
const accessToken = computed(() => store.state.accessToken)
const advisoryInformation = ref({})
const errorDescription = ref('')
const errorTitle = ref('')
const formValues = ref([])
const isLoading = ref(false) // TODO: Change this to false!
const optionsCoursesAffected = ref([])
const showErrorMessageBox = ref(false)
const showResult = ref(false)
const store = useStore()
const submitState = { isSubmitted: false }

const optionsCondition = [
  {
    label: 'Blocked',
    value: 'blocked',
    description: ''
  },
  {
    label: 'Passable but Difficult',
    value: 'passable',
    description: ''
  }
]

onMounted(async () => {
  if (props.action === 'new') {
    actionLabel.value = 'New'
  } else if (props.action === 'edit') {
    actionLabel.value = 'Update'
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/v1/courses/all/titles-slugs`,
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
      const dataProccessd = data.map(element => {
        const { _id: value, title: label } = element
        return { label, value, description: '' }
      })
      optionsCoursesAffected.value = dataProccessd
      isLoading.value = false
    }
  } catch (error) {
    throw new Error('Failed to fetch title slugs')
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
      if (props.action === 'new') {
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


    const method = props.action === 'new' ? 'POST' : 'PATCH'

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/advisories/advisory`, {
        method,
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

const updateFormErrors = formErrors => {
  if (formErrors.length > 0) {
    const errorMessages = formErrors.map(element => {
      return element.errorMessage
    })
    errorDescription.value = errorMessages.join('. ') + '.'

    const numberAgreement = formErrors.length === 1 ? 'An Error' : 'Errors'
    errorTitle.value = `The ${actionLabel.value} Advisory Form Has ${numberAgreement}`

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
  <div class="form-advisory">
    <h3>
      <span style="text-transform: capitalize;">{{ action }}</span> Advisory
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
      description="A new advisory has been created"
    />
    <n-form label-position="top">
      <InputName
        v-if="!isLoading"
        errorMessage="Please enter a valid facility name"
        inputName="facility"
        labeltext="Facility Name"
        placeholder="Enter the name of the road or trail the advisory applies to..."
        initial-value=""
        :required="true"
        @change-form-values="updateFormValues($event)"
      />
      <InputName
        v-if="!isLoading"
        errorMessage="Please enter a valid from location"
        inputName="from"
        labeltext="From or At"
        placeholder="Enter the name of an intersecting road or trail closest to the advisory..."
        initial-value=""
        :required="true"
        @change-form-values="updateFormValues($event)"
      />
      <InputName
        v-if="!isLoading"
        errorMessage="Please enter a valid to location"
        inputName="to"
        labeltext="To"
        placeholder="Enter the name of an intersecting road or trail closest to the advisory..."
        :required="false"
        initial-value=""
        @change-form-values="updateFormValues($event)"
      />
      <SelectGeneric
        errorMessage="Please select a condition"
        inputName="condition"
        labeltext="Condition"
        optionValue="condition"
        placeholder="Select a condition..."
        initial-value=""
        :options="optionsCondition"
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <SelectGeneric
        errorMessage="Please select at least one affected course"
        inputName="coursesAffected"
        labeltext="Courses Affected"
        optionValue="coursesAffected"
        placeholder="Select all courses affected..."
        initial-value=""
        :multiple="true"
        :options="optionsCoursesAffected"
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <InputDateTime
        input-name="startDate"
        labeltext="Closed Beginning"
        @change-form-values="updateFormValues($event)"
      />
      <InputDateTime
        input-name="endDate"
        labeltext="Closed Until"
        @change-form-values="updateFormValues($event)"
      />
      <SwitchIsPublished @change-form-values="updateFormValues($event)" />
      <n-button
        type="primary"
        attr-type="submit"
        @click="handleSubmit"
      >
        {{ props.submitActionLabel }}
      </n-button>
    </n-form>
    <pre>
{{ formValues }}
    </pre>
  </div>
</template>
