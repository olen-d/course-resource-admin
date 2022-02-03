<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input-number
      :placeholder="placeholder"
      @blur="handleBlur"
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
    const errorMessage = 'Please enter a valid length'
    const isValid = ref(false)
    const length = ref(0)
    const validationStatus = ref('')

    onMounted(() => {
      emit('changeFormValues', { inputName: 'length', inputValue: length.value, isValid: isValid.value, errorMessage })
    })
    const handleBlur = () => {
      isValid.value = validate(length.value)
      validationStatus.value = isValid.value ? null : 'error'
      emit('changeFormValues', { inputName: 'length', inputValue: length.value, isValid: isValid.value, errorMessage })
    }
    const validate = length => {
      const decimalNumber = /^[1-9][0-9]*(.?[0-9]*[1-9])*$/
      const isValid = decimalNumber.test(length)
      return isValid
    }
    watch(() => props.isServerError, (isServerError, prevIsServerError) => {
      if (isServerError) {
        validationStatus.value = 'error'
        emit('changeFormValues', { inputName: 'length', inputValue: length.value, isValid: false, errorMessage })
      }
    })
    return {
      handleBlur,
      isValid,
      length,
      validate,
      validationStatus
    }
  }
})
</script>
