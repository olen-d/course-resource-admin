<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInput } from 'naive-ui'

// Lodash is a CommonJS module
import pkgLodash from 'lodash'
const { debounce } = pkgLodash

const props = defineProps({
  errorMessage: {
    type: String,
    default: 'Please enter a valid password'
  },
  initialValue: {
    type: String,
    default: null
  },
  inputName: {
    type: String,
    default: 'plaintextPassword'
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Password'
  },
  placeholder: {
    type: String,
    default: 'Enter your password...'
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

const emits = defineEmits(['changeFormValues', 'removeFormValues'])

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
  handleChange()
}

const handleChange = () => {
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

const handleInput = debounce(() => {
  handleChange()
}, 500)


const validate = password => {
  const oneUpper = /[A-Z]/
  const oneLower = /[a-z]/
  const oneDigit = /\d/
  const oneSpecial = /[!@#$%^&*()-+=]/

  const isOneUpper = oneUpper.test(password)
  const isOneLower = oneLower.test(password)
  const isOneDigit = oneDigit.test(password)
  const isOneSpecial = oneSpecial.test(password)
  const isLength = password.length >= 8

  const isValid = isOneUpper && isOneLower && (isOneDigit || isOneSpecial) && isLength
  return isValid
}

watch(() => props.initialValue, (newInitialValue, prevInitialValue) => {
  inputValue.value = newInitialValue
  changedState.isChanged = false
  isValid.value = false
  emitChange(props.inputName, inputValue.value)
})

watch(() => props.isServerError, (newIsServerError, prevIsServerError) => {
  if (newIsServerError) {
    changedState.isChanged = true
    errorMessages.value = props.errorMessage
    validationStatus.value = 'error'
    isValid.value = false
    emitChange()
  }
})

watch(() => props.shouldClearInput, (newShouldClearInput, prevShouldClearInput) => {
  if (newShouldClearInput) {
    inputValue.value = null
    changedState.isChanged = false
    isValid.value = false
    emits('removeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
  }
})

</script>

<template>
  <n-form-item
    :label="labeltext"
    :label-props="{ for: inputName }"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input
      v-model:value="inputValue"
      :placeholder="placeholder"
      type="password"
      show-password-on="click"
      :input-props="{ name: inputName, id: inputName }"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
      @input="handleInput"
    />
  </n-form-item>
</template>
