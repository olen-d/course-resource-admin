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
      v-model:value="ascent"
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
      default: 'Ascent'
    },
    placeholder: {
      type: String,
      default: 'Enter the ascent...'
    }
  },
  setup (props, { emit }) {
    const changedState = { isChanged: false }
    const errorMessage = 'Please enter a valid ascent'
    const isValid = ref(false)
    const ascent = ref(0)
    const validationStatus = ref('')

    onMounted(() => {
      emit('changeFormValues', { inputName: 'ascent', inputValue: ascent.value, isChanged: false, isValid: isValid.value, errorMessage })
    })
    const handleBlur = () => {
      isValid.value = validate(ascent.value)
      validationStatus.value = isValid.value ? null : 'error'
      emit('changeFormValues', { inputName: 'ascent', inputValue: ascent.value, isChanged: true, isValid: isValid.value, errorMessage })
    }
    const handleChange = () => {
      if (!changedState.isChanged) {
        changedState.isChanged = true
        emit('changeFormValues', { inputName: 'ascent', inputValue: ascent.value, isChanged: true, isValid: isValid.value, errorMessage })
      }
    }
    const validate = ascent => {
      const decimalNumber = /^[1-9][0-9]*(.?[0-9]*[1-9])*$/
      const isValid = decimalNumber.test(ascent)
      return isValid
    }
    watch(() => props.isServerError, (isServerError, prevIsServerError) => {
      if (isServerError) {
        validationStatus.value = 'error'
        emit('changeFormValues', { inputName: 'ascent', inputValue: ascent.value, isChanged: true, isValid: false, errorMessage })
      }
    })
    return {
      handleBlur,
      handleChange,
      isValid,
      ascent,
      validate,
      validationStatus
    }
  }
})
</script>
