<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input-number
      :placeholder="placeholder"
      @blur="handleBlur"
      v-model:value="longitude"
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
      default: 'Longitude'
    },
    placeholder: {
      type: String,
      default: 'Enter the longitude...'
    }
  },
  setup (props, { emit }) {
    const changedState = { isChanged: false }
    const errorMessage = 'Please enter a valid longitude'
    const isValid = ref(false)
    const longitude = ref(0)
    const validationStatus = ref('')

    onMounted(() => {
      emitChange()
    })

    const emitChange = () => {
      emit('changeFormValues', { inputName: 'longitude', inputValue: longitude.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
    }

    const handleBlur = () => {
      if (!changedState.isChanged) {
        changedState.isChanged = true
      }
      isValid.value = validate(longitude.value)
      validationStatus.value = isValid.value ? null : 'error'
      emitChange()
    }

    const validate = longitude => {
      const isNumber = Number.isFinite(longitude)
      const isValid = isNumber && longitude >= -180 && longitude <= 180
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
      longitude,
      validate,
      validationStatus
    }
  }
})
</script>
