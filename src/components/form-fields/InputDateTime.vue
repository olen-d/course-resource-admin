<script setup>
import { onMounted, ref, watch } from 'vue'

import { NDatePicker, NFormItem } from 'naive-ui'

const emits = defineEmits(['changeFormValues'])

const props = defineProps({
  errorMessage: {
    type: String,
    default: 'Please enter a valid date and time'
  },
  initialValue: {
    type: String,
    default: ''
  },
  inputName: {
    type: String,
    default: 'timestamp'
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Publish On'
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
const inputValue = ref(0)
const validationStatus = ref('')

onMounted(() => {
  inputValue.value = props.initialValue === '' ? Date.now() : new Date(props.initialValue).getTime()
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
  const isValid = value >= 0
  return isValid
}

watch(() => props.initialValue, (newInitialValue, prevInitialValue) => {
  if (newInitialValue) {
    inputValue.value = new Date(newInitialValue).getTime()
  }
})

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
  <div class="input-date-time">
    <n-form-item
      :label="labeltext"
      :validation-status="validationStatus"
      :required="required"
    >
      <n-date-picker
        v-model:value="inputValue"
        type="datetime"
        :clearable="true"
        style="margin-bottom: 0.5rem"
        @blur="handleBlur"
      />
    </n-form-item>
  </div>
</template>
