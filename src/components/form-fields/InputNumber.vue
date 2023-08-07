<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInputNumber } from 'naive-ui'

const emits = defineEmits(['changeFormValues'])

const props = defineProps({
  errorMessage: {
    type: String,
    default: 'Please enter a valid number'
  },
  initialValue: {
    type: Number,
    default: null
  },
  inputName: {
    type: String,
    default: 'number'
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Number'
  },
  placeholder: {
    type: String,
    default: 'Enter a number...'
  },
  required: {
    type: Boolean,
    default: false
  },
  shouldClearInput: {
    type: Boolean,
    default: false
  }
})

const changedState = { isChanged: false }
const errorMessages = ref('')
const isValid = ref(false)
const inputValue = ref(null)
const validationStatus = ref('')

onMounted(() => {
  inputValue.value = props.initialValue
  emitChange(props.inputName, inputValue.value)
})

const emitChange = (name, value) => {
  emits('changeFormValues', { inputName: name, inputValue: value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(inputValue.value)
  if (isValid.value) {
    errorMessages.value = ''
    validationStatus.value = null
  } else {
    errorMessages.value = props.errorMessage
    validationStatus.value = 'error'
  }
  emitChange(props.inputName, inputValue.value)
}

const validate = value => {
  const isValid = Number.isFinite(value)
  return isValid
}

watch(() => props.isServerError, (newIsServerError, prevIsServerError) => {
  if (newIsServerError) {
    changedState.isChanged = true
    errorMessages.value = props.errorMessage
    validationStatus.value = 'text-error'
    isValid.value = false
    emitChange(props.inputName, inputValue.value)
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
