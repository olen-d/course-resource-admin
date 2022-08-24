<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInput } from 'naive-ui'

const props = defineProps({
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
  }
})

const emit = defineEmits(['changeFormValues'])

const errorMessage = 'Please enter a valid password'
const isValid = ref(false)
const plaintextPassword = ref('')
const validationStatus = ref('')

onMounted(() => {
  emit('changeFormValues', { inputName: 'plaintextPassword', inputValue: plaintextPassword.value, isValid: isValid.value, errorMessage })
})
const handleBlur = () => {
  isValid.value = validate(plaintextPassword.value)
  validationStatus.value = isValid.value ? null : 'error'
  emit('changeFormValues', { inputName: 'plaintextPassword', inputValue: plaintextPassword.value, isValid: isValid.value, errorMessage })
}
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
watch(() => props.isServerError, (isServerError, prevIsServerError) => {
  if (isServerError) {
    validationStatus.value = 'error'
    emit('changeFormValues', { inputName: 'plaintextPassword', inputValue: plaintextPassword.value, isValid: false, errorMessage })
  }
})

</script>

<template>
  <n-form-item
    :label="labeltext"
    :label-props="{ for: 'plaintextPassword' }"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input
      :placeholder="placeholder"
      @blur="handleBlur"
      v-model:value="plaintextPassword"
      type="password"
      show-password-on="click"
      :input-props="{ name: 'plaintextPassword', id: 'plaintextPassword' }"
      style="margin-bottom: 0.5rem"
    >
    </n-input>
  </n-form-item>
</template>
