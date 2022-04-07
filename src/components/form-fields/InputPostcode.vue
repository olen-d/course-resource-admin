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
    default: 'Postcode'
  },
  placeholder: {
    type: String,
    default: 'Enter the postcode...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid postcode'
const isValid = ref(false)
const postcode = ref('')
const validationStatus = ref('')

onMounted(() => {
  postcode.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'postcode', inputValue: postcode.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(postcode.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = postcode => {
  const zipcode = /^\d{5}(-\d{4})?$/
  const isValid = zipcode.test(postcode)
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
      v-model:value="postcode"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
