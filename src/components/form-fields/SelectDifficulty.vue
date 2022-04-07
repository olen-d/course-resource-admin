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
    default: 'Difficulty'
  },
  placeholder: {
    type: String,
    default: 'Select a difficulty...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please select a valid difficulty'
const isValid = ref(false)
const difficulty = ref('')
const options = [
  {
    label: 'Easiest',
    value: 'easiest',
    description: ''
  },
  {
    label: 'Easy',
    value: 'easy',
    description: ''
  },
  {
    label: 'More Difficult',
    value: 'more difficult',
    description: ''
  },
  {
    label: 'Very Difficult',
    value: 'very difficult',
    description: ''
  },
  {
    label: 'Extremely Difficult',
    value: 'extremely difficult',
    description: ''
  }
]
const validationStatus = ref('')

onMounted(() => {
  difficulty.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'difficulty', inputValue: difficulty.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(difficulty.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = difficulty => {
  const isValid = typeof difficulty === 'string' && difficulty.length > 0
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
      v-model:value="difficulty"
      :placeholder="placeholder"
      :options="options"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
