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
      v-model:value="facts"
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
      default: 'Facts'
    },
    placeholder: {
      type: String,
      default: 'Enter facts...'
    }
  },
  setup (props, { emit }) {
    const changedState = { isChanged: false }
    const errorMessage = 'Please enter valid facts'
    const isValid = ref(false)
    const facts = ref('')
    const validationStatus = ref('')

    onMounted(() => {
      emitChange()
    })

    const emitChange = () => {
      emit('changeFormValues', { inputName: 'facts', inputValue: facts.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
    }

    const handleBlur = () => {
      if (!changedState.isChanged) {
        changedState.isChanged = true
      }
      isValid.value = validate(facts.value)
      validationStatus.value = isValid.value ? null : 'error'
      emitChange()
    }

    const validate = facts => {
      const isValid = typeof facts === 'string' && facts.length > 0
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
      facts,
      handleBlur,
      isValid,
      validate,
      validationStatus
    }
  }
})
</script>
