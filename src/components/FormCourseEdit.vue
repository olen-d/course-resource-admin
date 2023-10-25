<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { NAlert, NButton, NForm, NResult } from 'naive-ui'

import InputAscent from '@/components/form-fields/InputAscent.vue'
import InputAddress from '@/components/form-fields/InputAddress.vue'
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

const props = defineProps({
  slug: {
    type: String,
    required: true
  },
  submitActionLabel: {
    type: String,
    default: 'Submit'
  }
})

const accessToken = computed(() => store.state.accessToken)
const courseInformation = ref({})
const errorDescription = ref('')
const errorTitle = ref('')
const formValues = ref([])
const isLoading = ref(true)
const showErrorMessageBox = ref(false)
const showResult = ref(false)
const store = useStore()
const submitState = { isSubmitted: false }

onMounted(async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/courses/${props.slug}/all`,
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
    courseInformation.value = data[0]
    isLoading.value = false
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/courses/course/${courseInformation.value._id}`, {
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
  <div class="form-course-edit">
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
      <InputTitle
        v-if="courseInformation.title"
        :initial-value="courseInformation.title"
        @change-form-values="updateFormValues($event)"
      />
      <InputLength
        v-if="courseInformation.length"
        :initial-value="courseInformation.length"
        @change-form-values="updateFormValues($event)"
      />
      <InputAscent
        v-if="courseInformation.ascent"
        :initial-value="courseInformation.ascent"
        @change-form-values="updateFormValues($event)"
      />
      <InputLatitude
        v-if="courseInformation.location"
        :initial-value="courseInformation.location.latitude"
        @change-form-values="updateFormValues($event)"
      />
      <InputLongitude
        v-if="courseInformation.location"
        :initial-value="courseInformation.location.longitude"
        @change-form-values="updateFormValues($event)"
      />
      <InputAddress
        v-if="courseInformation.location"
        :initial-value="courseInformation.location.address"
        @change-form-values="updateFormValues($event)"
      />
      <InputCity
        v-if="courseInformation.location"
        :initial-value="courseInformation.location.city"
        @change-form-values="updateFormValues($event)"
      />
      <InputState
        v-if="courseInformation.location"
        :initial-value="courseInformation.location.state"
        @change-form-values="updateFormValues($event)"
      />
      <InputCountry
        v-if="courseInformation.location"
        :initial-value="courseInformation.location.country"
        @change-form-values="updateFormValues($event)"
      />
      <InputPostcode
        v-if="courseInformation.location"
        :initial-value="courseInformation.location.postcode"
        @change-form-values="updateFormValues($event)"
      />
      <SelectDifficulty
        v-if="courseInformation.difficulty"
        :initial-value="courseInformation.difficulty"
        @change-form-values="updateFormValues($event)"
      />
      <InputBrief
        v-if="courseInformation.brief"
        :initial-value="courseInformation.brief"
        @change-form-values="updateFormValues($event)"
      />
      <InputSummary
        v-if="courseInformation.summary"
        :initial-value="courseInformation.summary"
        @change-form-values="updateFormValues($event)"
      />
      <SelectTerrain
        v-if="courseInformation.terrain"
        :initial-value="courseInformation.terrain"
        @change-form-values="updateFormValues($event)"
      />
      <SelectSetting
        v-if="courseInformation.setting"
        :initial-value="courseInformation.setting"
        @change-form-values="updateFormValues($event)"
      />
      <RateHappiness
        v-if="courseInformation.happiness"
        :initial-value="courseInformation.happiness"
        @change-form-values="updateFormValues($event)"
      />
      <InputFacts
        v-if="courseInformation.facts"
        :initial-value="courseInformation.facts"
        @change-form-values="updateFormValues($event)"
      />
      <InputParking
        v-if="courseInformation.parking"
        :initial-value="courseInformation.parking"
        @change-form-values="updateFormValues($event)"
      />
      <InputCreation
        v-if="courseInformation.creation"
        :initial-value="courseInformation.creation"
        @change-form-values="updateFormValues($event)"
      />
      <InputDateTime
        v-if="courseInformation.publishOn"
        :initial-value="courseInformation.publishOn"
        input-name="publishOn"
        @change-form-values="updateFormValues($event)"
      />
      <SwitchIsPublished
        v-if="courseInformation.isPublished || courseInformation.isPublished === false"
        :initial-value="courseInformation.isPublished"
        @change-form-values="updateFormValues($event)"
      />
      <InputRideWithGPSURI
        v-if="courseInformation.mapLink"
        :initial-value="courseInformation.mapLink"
        @change-form-values="updateFormValues($event)"
      />
      <InputDogStatistics
        v-if="!isLoading"
        :initial-value="courseInformation?.dogStatistics?.totalChases"
        input-name="totalChases"
        labeltext="Dog Chases"
        @change-form-values="updateFormValues($event)"
      />
      <InputDogStatistics
        v-if="!isLoading"
        :initial-value="courseInformation?.dogStatistics?.totalDogs"
        input-name="totalDogs"
        labeltext="Total Dogs"
        @change-form-values="updateFormValues($event)"
      />
      <InputDogStatistics
        v-if="!isLoading"
        :initial-value="courseInformation?.dogStatistics?.totalLegs"
        input-name="totalLegs"
        labeltext="Total Legs"
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
