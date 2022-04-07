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
    default: 'Length'
  },
  placeholder: {
    type: String,
    default: 'Enter the length...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid length'
const isValid = ref(false)
const length = ref(0)
const validationStatus = ref('')

onMounted(() => {
  length.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'length', inputValue: length.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(length.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = length => {
  const isNumber = Number.isFinite(length)
  const isValid = isNumber && length > 0
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
      v-model:value="length"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
