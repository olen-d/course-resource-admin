<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInput } from 'naive-ui'

// Lodash is a CommonJS module
import pkgLodash from 'lodash'
const { debounce } = pkgLodash

const props = defineProps({
  errorMessage: {
    type: String,
    default: 'Please enter a valid name'
  },
  initialValue: {
    type: String,
    default: null
  },
  inputName: {
    type: String,
    default: 'name'
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Name'
  },
  placeholder: {
    type: String,
    default: 'Enter your name...'
  },
  required: {
    type: Boolean,
    default: false
  },
  shouldClearInput: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['changeFormValues', 'removeFormValues'])

const changedState = { isChanged: false }
const errorMessages = ref('')
const isValid = ref(false)
const inputValue = ref('')
const validationStatus = ref('')

onMounted(() => {
  inputValue.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isRequired: props.required, isValid: isValid.value, errorMessage: props.errorMessage })
}

const handleBlur = () => {
  handleChange()
}

const handleChange = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = props.required || inputValue.value?.length > 0 ? validate(inputValue.value) : true
  if (isValid.value) {
    errorMessages.value = ''
    validationStatus.value = null
  } else {
    errorMessages.value = props.errorMessage
    validationStatus.value = 'error'
  }
  emitChange()
}

const handleInput = debounce(() => {
  handleChange()
}, 500)

const validate = value => {
  const alphaNumeric = /^[a-zA-Z\-]+( ?[a-zA-Z\-])*$/
  const isValid = value?.length > 0 && alphaNumeric.test(value)
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
  <div class="input-name">
    <n-form-item
      :label="labeltext"
      :label-props="{ for: inputName }"
      :validation-status="validationStatus"
      :required="required"
    >
    <n-input
      v-model:value="inputValue"
      :placeholder="placeholder"
      :clearable="true"
      :input-props="{ name: inputName, id: inputName }"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
      @input="handleInput"
    />
    </n-form-item>
  </div>
</template>
