<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInputNumber } from 'naive-ui'

const emits = defineEmits(['changeFormValues'])

const props = defineProps({
  initialValue: {
    type: Number,
    default: 0
  },
  inputName: {
    type: String,
    required: true
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Enter the dog statistics...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid ascent'
const isValid = ref(false)
const inputValue = ref(0)
const validationStatus = ref('')

onMounted(() => {
  inputValue.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(inputValue.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = value => {
  const isNumber = Number.isFinite(value)
  const isValid = isNumber && value >= 0
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
      v-model:value="inputValue"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
