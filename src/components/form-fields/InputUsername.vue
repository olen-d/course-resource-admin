<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input
      :placeholder="placeholder"
      @blur="handleBlur"
      v-model:value="username"
      :clearable="true"
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
      default: 'Username'
    },
    placeholder: {
      type: String,
      default: 'Enter your username...'
    }
  },
  setup (props, { emit }) {
    const errorMessage = 'Please enter a valid username'
    const isValidUsername = ref(false)
    const username = ref('')
    const validationStatus = ref('')

    onMounted(() => {
      emit('changeUsername', { inputName: 'username', inputValue: username.value, isValid: isValidUsername.value, errorMessage })
    })
    const handleBlur = () => {
      isValidUsername.value = validate(username.value)
      validationStatus.value = isValidUsername.value ? null : 'error'
      emit('changeUsername', { inputName: 'username', inputValue: username.value, isValid: isValidUsername.value, errorMessage })
    }
    const validate = username => {
      const alphaNumeric = /^[a-zA-Z0-9\-_]+$/
      const isValid = alphaNumeric.test(username)
      return isValid
    }
    watch(() => props.isServerError, (isServerError, prevIsServerError) => {
      if (isServerError) {
        validationStatus.value = 'error'
        emit('changeUsername', { inputName: 'username', inputValue: username.value, isValid: false, errorMessage })
      }
    })
    return {
      isValidUsername,
      username,
      handleBlur,
      validate,
      validationStatus
    }
  }
})
</script>
