<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input
      :placeholder="placeholder"
      @blur="handleBlur"
      v-model:value="plaintextPassword"
      type="password"
      show-password-on="click"
      style="margin-bottom: 0.5rem"
    >
    </n-input>
  </n-form-item>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'

import { NFormItem, NInput } from 'naive-ui'

export default defineComponent({
  components: { NFormItem, NInput },

  props: {
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
  },
  setup (props, { emit }) {
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
    return {
      isValid,
      plaintextPassword,
      handleBlur,
      validate,
      validationStatus
    }
  }
})
</script>
