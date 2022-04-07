<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInputNumber } from 'naive-ui'

const emits = defineEmits(['changeFormValues'])

const props = defineProps({
  initialValue: {
    type: Number,
    default: 0
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Longitude'
  },
  placeholder: {
    type: String,
    default: 'Enter the longitude...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid longitude'
const isValid = ref(false)
const longitude = ref(0)
const validationStatus = ref('')

onMounted(() => {
  longitude.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'longitude', inputValue: longitude.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(longitude.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = longitude => {
  const isNumber = Number.isFinite(longitude)
  const isValid = isNumber && longitude >= -180 && longitude <= 180
  return isValid
}

watch(() => props.isServerError, (isServerError, prevIsServerError) => {
  if (isServerError) {
    validationStatus.value = 'error'
    isValid.value = false
    emitChange()
  }
})
</script>

<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input-number
      v-model:value="longitude"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      :placeholder="placeholder"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
