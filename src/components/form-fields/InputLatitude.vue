<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input-number
      :placeholder="placeholder"
      @blur="handleBlur"
      v-model:value="latitude"
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
      default: 'Latitude'
    },
    placeholder: {
      type: String,
      default: 'Enter the latitude...'
    }
  },
  setup (props, { emit }) {
    const changedState = { isChanged: false }
    const errorMessage = 'Please enter a valid latitude'
    const isValid = ref(false)
    const latitude = ref(0)
    const validationStatus = ref('')

    onMounted(() => {
      emitChange()
    })

    const emitChange = () => {
      emit('changeFormValues', { inputName: 'latitude', inputValue: latitude.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
    }

    const handleBlur = () => {
      if (!changedState.isChanged) {
        changedState.isChanged = true
      }
      isValid.value = validate(latitude.value)
      validationStatus.value = isValid.value ? null : 'error'
      emitChange()
    }

    const validate = latitude => {
      const isNumber = Number.isFinite(latitude)
      const isValid = isNumber && latitude >= -90 && latitude <= 90
      return isValid
    }

    watch(() => props.isServerError, (isServerError, prevIsServerError) => {
      if (isServerError) {
        validationStatus.value = 'error'
        isValid.value = false
        emitChange()
      }
    })
    return {
      handleBlur,
      isValid,
      latitude,
      validate,
      validationStatus
    }
  }
})
</script>
