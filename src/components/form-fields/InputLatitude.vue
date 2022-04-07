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
    default: 'Latitude'
  },
  placeholder: {
    type: String,
    default: 'Enter the latitude...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid latitude'
const isValid = ref(false)
const latitude = ref(0)
const validationStatus = ref('')

onMounted(() => {
  latitude.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'latitude', inputValue: latitude.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(latitude.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = latitude => {
  const isNumber = Number.isFinite(latitude)
  const isValid = isNumber && latitude >= -90 && latitude <= 90
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
      v-model:value="latitude"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
