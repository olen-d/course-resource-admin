<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input-number
      :placeholder="placeholder"
      @blur="handleBlur"
      on-update:value="handleChange"
      v-model:value="length"
      :clearable="true"
      style="margin-bottom: 0.5rem"
    >
    </n-input-number>
  </n-form-item>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'

import { NFormItem, NInputNumber } from 'naive-ui'

export default defineComponent({
  components: { NFormItem, NInputNumber },
  props: {
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
  },
  setup (props, { emit }) {
    const changedState = { isChanged: false }
    const errorMessage = 'Please enter a valid length'
    const isValid = ref(false)
    const length = ref(0)
    const validationStatus = ref('')

    onMounted(() => {
      emit('changeFormValues', { inputName: 'length', inputValue: length.value, isChanged: false, isValid: isValid.value, errorMessage })
    })
    const handleBlur = () => {
      isValid.value = validate(length.value)
      validationStatus.value = isValid.value ? null : 'error'
      emit('changeFormValues', { inputName: 'length', inputValue: length.value, isChanged: true, isValid: isValid.value, errorMessage })
    }
    const handleChange = () => {
      if (!changedState.isChanged) {
        changedState.isChanged = true
        emit('changeFormValues', { inputName: 'length', inputValue: length.value, isChanged: true, isValid: isValid.value, errorMessage })
      }
    }
    const validate = length => {
      const decimalNumber = /^[1-9][0-9]*(.?[0-9]*[1-9])*$/
      const isValid = decimalNumber.test(length)
      return isValid
    }
    watch(() => props.isServerError, (isServerError, prevIsServerError) => {
      if (isServerError) {
        validationStatus.value = 'error'
        emit('changeFormValues', { inputName: 'length', inputValue: length.value, isChanged: true, isValid: false, errorMessage })
      }
    })
    return {
      handleBlur,
      handleChange,
      isValid,
      length,
      validate,
      validationStatus
    }
  }
})
</script>
