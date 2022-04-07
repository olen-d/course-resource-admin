<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NSelect } from 'naive-ui'

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
    default: 'Setting'
  },
  placeholder: {
    type: String,
    default: 'Select a setting...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please select a valid setting'
const isValid = ref(false)
const setting = ref('')
const options = [
  {
    label: 'Urban',
    value: 'urban',
    description: ''
  },
  {
    label: 'Suburban',
    value: 'suburban',
    description: ''
  },
  {
    label: 'Rural',
    value: 'rural',
    description: ''
  },
  {
    label: 'Forest',
    value: 'forest',
    description: ''
  }
]
const validationStatus = ref('')

onMounted(() => {
  setting.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'setting', inputValue: setting.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(setting.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = setting => {
  const isValid = typeof setting === 'string' && setting.length > 0
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
    <n-select
      v-model:value="setting"
      :placeholder="placeholder"
      :options="options"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
