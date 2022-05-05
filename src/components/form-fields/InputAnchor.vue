<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInput } from 'naive-ui'

const emits = defineEmits(['changeFormValues'])

const props = defineProps({
  initialValue: {
    type: String,
    default: ''
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Anchor'
  },
  placeholder: {
    type: String,
    default: 'Enter text for the link...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid anchor'
const isValid = ref(false)
const anchor = ref('')
const validationStatus = ref('')

onMounted(() => {
  anchor.value = props.initialValue
  emitChange('anchor', anchor.value)
})

const emitChange = (name, value) => {
  const isValidValue = name === 'anchor' ? isValid.value : true
  const errorMessageValue = name === 'anchor' ? errorMessage : null
  emits('changeFormValues', { inputName: name, inputValue: value, isChanged: changedState.isChanged, isValid: isValidValue, errorMessage: errorMessageValue })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(anchor.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange('anchor', anchor.value)
}

const validate = anchor => {
  const alphaNumericPunctuation = /^[a-zA-Z0-9-]+[!?.]*(,? [a-zA-Z0-9-]+[!?.]*)*$/
  const isValid = alphaNumericPunctuation.test(anchor)
  return isValid
}

watch(() => props.isServerError, (isServerError, prevIsServerError) => {
  if (isServerError) {
    validationStatus.value = 'error'
    isValid.value = false
    emitChange('anchor', anchor.value)
  }
})
</script>

<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="true"
  >
    <n-input
      v-model:value="anchor"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
