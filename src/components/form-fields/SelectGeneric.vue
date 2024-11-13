<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NSelect } from 'naive-ui'

const props = defineProps({
  errorMessage: {
    type: String,
    default: 'Please select an option'
  },
  initialValue: {
    type: [Array, String],
    default: ''
  },
  inputName: {
    type: String,
    default: 'selectGeneric'
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Select'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    required: true
  },
  optionTitle: {
    type: String,
    default: 'title'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  required: {
    type: Boolean,
    default: false
  },
  shouldClearInput: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Select an option...'
  }
})

const emits = defineEmits(['changeFormValues', 'removeFormValues'])

const changedState = { isChanged: false }
const errorMessages = ref('')
const isValid = ref(false)
const inputValue = ref(null)
const validationStatus = ref('')

onMounted(() => {
  inputValue.value = props.initialValue === '' ? null : props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
}

const handleBlur = () => {
  handleChange()
}

const handleChange = event => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(inputValue.value)
  if (isValid.value) {
      errorMessages.value = ''
      validationStatus.value = null
    } else {
      errorMessages.value = props.errorMessage
      validationStatus.value = 'error'
    }
  emitChange()
}

const handleInput = () => {
  handleChange()
}

const validate = selectValue => {
  const isValid = props.multiple ? Array.isArray(selectValue) && selectValue.length > 0 : typeof selectValue === 'string' && selectValue.length > 0
  return isValid
}

watch(() => props.initialValue, (newInitialValue, prevInitialValue) => {
  inputValue.value = newInitialValue
  changedState.isChanged = false
  isValid.value = false
  emitChange(props.inputName, inputValue.value)
})

watch(() => props.isServerError, (newIsServerError, prevIsServerError) => {
  if (newIsServerError) {
    changedState.isChanged = true
    errorMessages.value = props.errorMessage
    validationStatus.value = 'error'
    isValid.value = false
    emitChange()
  }
})

watch(() => props.shouldClearInput, (newShouldClearInput, prevShouldClearInput) => {
  if (newShouldClearInput) {
    inputValue.value = null
    changedState.isChanged = false
    isValid.value = false
    emits('removeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
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
      v-model:value="inputValue"
      :multiple="multiple"
      :placeholder="placeholder"
      :options="options"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
      @update:value="handleInput"
    />
  </n-form-item>
</template>
