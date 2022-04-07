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
    default: 'Country'
  },
  placeholder: {
    type: String,
    default: 'Enter the country...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid country'
const isValid = ref(false)
const country = ref('')
const validationStatus = ref('')

onMounted(() => {
  country.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'country', inputValue: country.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(country.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = country => {
  const isValid = typeof country === 'string' && country.length > 0
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
      v-model:value="country"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
