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
    default: 'Parking'
  },
  placeholder: {
    type: String,
    default: 'Enter parking information...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter valid parking information'
const isValid = ref(false)
const parking = ref('')
const validationStatus = ref('')

onMounted(() => {
  parking.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'parking', inputValue: parking.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(parking.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = parking => {
  const isValid = typeof parking === 'string' && parking.length > 0
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
      v-model:value="parking"
      type="textarea"
      rows="6"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
