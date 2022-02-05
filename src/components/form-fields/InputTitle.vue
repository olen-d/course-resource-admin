<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input
      :placeholder="placeholder"
      @blur="handleBlur"
      @change="handleChange"
      v-model:value="title"
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
      default: 'Title'
    },
    placeholder: {
      type: String,
      default: 'Enter a title...'
    }
  },
  setup (props, { emit }) {
    const changedState = { isChanged: false }
    const errorMessage = 'Please enter a valid title'
    const isValid = ref(false)
    const title = ref('')
    const validationStatus = ref('')

    onMounted(() => {
      emit('changeFormValues', { inputName: 'title', inputValue: title.value, isChanged: false, isValid: isValid.value, errorMessage })
    })
    const handleBlur = () => {
      isValid.value = validate(title.value)
      validationStatus.value = isValid.value ? null : 'error'
      emit('changeFormValues', { inputName: 'title', inputValue: title.value, isChanged: true, isValid: isValid.value, errorMessage })
    }
    const handleChange = () => {
      if (!changedState.isChanged) {
        changedState.isChanged = true
        emit('changeFormValues', { inputName: 'title', inputValue: title.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
      }
    }
    const validate = title => {
      const alphaNumericPunctuation = /^[a-zA-Z0-9-]+[!?.]*(,? [a-zA-Z0-9-]+[!?.]*)*$/
      const isValid = alphaNumericPunctuation.test(title)
      return isValid
    }
    watch(() => props.isServerError, (isServerError, prevIsServerError) => {
      if (isServerError) {
        validationStatus.value = 'error'
        emit('changeFormValues', { inputName: 'title', inputValue: title.value, isChanged: true, isValid: false, errorMessage })
      }
    })
    return {
      handleBlur,
      handleChange,
      isValid,
      title,
      validate,
      validationStatus
    }
  }
})
</script>
