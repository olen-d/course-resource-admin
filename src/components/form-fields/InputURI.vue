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
    default: 'Link'
  },
  placeholder: {
    type: String,
    default: 'Enter the Link URI...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid link URI'
const isValid = ref(false)
const uri = ref('')
const validationStatus = ref('')

onMounted(() => {
  uri.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'uri', inputValue: uri.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(uri.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = linkUri => {
  const uriRegEx = /^(http|https):\/\/[^ "]+$/ // Extremely simple, should prevent obvious errors
  const isValid = uriRegEx.test(linkUri)
  return isValid
}

watch(() => props.isServerError, (isServerError, prevIsServerError) => {
  if (isServerError) {
    validationStatus.value = 'error'
    isValid.value = false
    emitChange()
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
      v-model:value="uri"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
