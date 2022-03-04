<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input
      :placeholder="placeholder"
      @blur="handleBlur"
      v-model:value="rideWithGPSURI"
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
      default: 'Ride With GPS Link'
    },
    placeholder: {
      type: String,
      default: 'Enter a the Ride With GPS Link...'
    }
  },
  setup (props, { emit }) {
    const changedState = { isChanged: false }
    const errorMessage = 'Please enter a valid Ride With GPS link'
    const isValid = ref(false)
    const rideWithGPSURI = ref('')
    const validationStatus = ref('')

    onMounted(() => {
      emitChange()
    })

    const emitChange = () => {
      emit('changeFormValues', { inputName: 'mapLink', inputValue: rideWithGPSURI.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
    }

    const handleBlur = () => {
      if (!changedState.isChanged) {
        changedState.isChanged = true
      }
      isValid.value = validate(rideWithGPSURI.value)
      validationStatus.value = isValid.value ? null : 'error'
      emitChange()
    }

    const validate = rideWithGPSURI => {
      const rwgps = /^https:\/\/ridewithgps\.com\/embeds\?type=route&id=[A-Za-z0-9]+/
      const isValid = rwgps.test(rideWithGPSURI)
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
      rideWithGPSURI,
      validationStatus
    }
  }
})
</script>
