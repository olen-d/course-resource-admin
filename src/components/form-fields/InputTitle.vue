<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input
      :placeholder="placeholder"
      @blur="handleBlur"
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
    const errorMessage = 'Please enter a valid title'
    const isValid = ref(false)
    const title = ref('')
    const validationStatus = ref('')

    onMounted(() => {
      emit('changeFormValues', { inputName: 'title', inputValue: title.value, isValid: isValid.value, errorMessage })
    })
    const handleBlur = () => {
      isValid.value = validate(title.value)
      validationStatus.value = isValid.value ? null : 'error'
      emit('changeFormValues', { inputName: 'title', inputValue: title.value, isValid: isValid.value, errorMessage })
    }
    const validate = title => {
      const alphaNumericPunctuation = /^[a-zA-Z0-9-]+[!?.]*(,? [a-zA-Z0-9-]+[!?.]*)*$/
      const isValid = alphaNumericPunctuation.test(title)
      return isValid
    }
    watch(() => props.isServerError, (isServerError, prevIsServerError) => {
      if (isServerError) {
        validationStatus.value = 'error'
        emit('changeFormValues', { inputName: 'title', inputValue: title.value, isValid: false, errorMessage })
      }
    })
    return {
      isValid,
      title,
      handleBlur,
      validate,
      validationStatus
    }
  }
})
</script>
