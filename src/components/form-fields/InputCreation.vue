<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input
      type="textarea"
      rows=6
      :placeholder="placeholder"
      @blur="handleBlur"
      v-model:value="creation"
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
      default: 'Creation'
    },
    placeholder: {
      type: String,
      default: 'Enter course creation information...'
    }
  },
  setup (props, { emit }) {
    const changedState = { isChanged: false }
    const errorMessage = 'Please enter valid creation information'
    const isValid = ref(false)
    const creation = ref('')
    const validationStatus = ref('')

    onMounted(() => {
      emitChange()
    })

    const emitChange = () => {
      emit('changeFormValues', { inputName: 'creation', inputValue: creation.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
    }

    const handleBlur = () => {
      if (!changedState.isChanged) {
        changedState.isChanged = true
      }
      isValid.value = validate(creation.value)
      validationStatus.value = isValid.value ? null : 'error'
      emitChange()
    }

    const validate = creation => {
      const isValid = typeof creation === 'string' && creation.length > 0
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
      creation,
      handleBlur,
      isValid,
      validate,
      validationStatus
    }
  }
})
</script>
