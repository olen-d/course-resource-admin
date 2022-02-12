<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-rate @update:value="handleUpdate" />
  </n-form-item>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'

import { NFormItem, NRate } from 'naive-ui'

export default defineComponent({
  components: { NFormItem, NRate },
  props: {
    isServerError: {
      type: Boolean,
      default: false
    },
    labeltext: {
      type: String,
      default: 'Happiness'
    },
    placeholder: {
      type: String,
      default: 'Provide a happiness rating...'
    }
  },
  setup (props, { emit }) {
    const changedState = { isChanged: false }
    const errorMessage = 'Please enter a valid rating'
    const isValid = ref(false)
    const happiness = ref(0)
    const validationStatus = ref('')

    onMounted(() => {
      emitChange()
    })

    const emitChange = () => {
      emit('changeFormValues', { inputName: 'happiness', inputValue: happiness.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
    }

    const handleUpdate = (value) => {
      happiness.value = value
      if (!changedState.isChanged) {
        changedState.isChanged = true
      }
      isValid.value = validate(happiness.value)
      validationStatus.value = isValid.value ? null : 'error'
      emitChange()
    }

    const validate = happiness => {
      const isValid = happiness > 0 && happiness <= 5
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
      handleUpdate,
      happiness,
      isValid,
      validate,
      validationStatus
    }
  }
})
</script>
