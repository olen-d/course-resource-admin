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
    default: 'Category'
  },
  placeholder: {
    type: String,
    default: 'Select a category...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please select a valid category'
const isValid = ref(false)
const category = ref('')
const options = [
  {
    label: 'General',
    value: 'general',
    description: ''
  },
  {
    label: 'Social Media',
    value: 'socialMedia',
    description: ''
  }
]
const validationStatus = ref('')

onMounted(() => {
  category.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'category', inputValue: category.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(category.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = category => {
  const isValid = typeof category === 'string' && category.length > 0
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
      v-model:value="category"
      :placeholder="placeholder"
      :options="options"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
