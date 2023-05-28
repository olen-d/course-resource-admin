<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInput } from 'naive-ui'

const emits = defineEmits(['changeFormValues'])

const props = defineProps({
  errorMessage: {
    type: String,
    default: 'Please enter a valid brief'
  },
  initialValue: {
    type: String,
    default: ''
  },
  inputName: {
    type: String,
    default: 'brief'
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Brief'
  },
  placeholder: {
    type: String,
    default: 'Enter a brief overview of the course...'
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
const inputValue = ref('')
const validationStatus = ref('')

onMounted(() => {
  inputValue.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
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
  emitChange()
}

const validate = value => {
  const isValid = typeof value === 'string' && value.length > 0
  return isValid
}

watch(() => props.isServerError, (newIsServerError, prevIsServerError) => {
  if (newIsServerError) {
    changedState.isChanged = true
    errorMessages.value = props.errorMessage
    validationStatus.value = 'text-error'
    isValid.value = false
    emitChange()
  }
})

</script>

<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="required"
  >
    <n-input
      v-model:value="inputValue"
      type="textarea"
      rows="2"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
