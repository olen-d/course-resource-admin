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
    default: 'Brief'
  },
  placeholder: {
    type: String,
    default: 'Enter a brief overview of the course...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid brief'
const isValid = ref(false)
const brief = ref('')
const validationStatus = ref('')

onMounted(() => {
  brief.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'brief', inputValue: brief.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(brief.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = summary => {
  const isValid = typeof summary === 'string' && summary.length > 0
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
      v-model:value="brief"
      type="textarea"
      rows="2"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
