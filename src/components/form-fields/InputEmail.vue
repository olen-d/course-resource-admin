<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInput } from 'naive-ui'

const props = defineProps({
  errorMessage: {
    type: String,
    default: 'Please enter a valid email address'
  },
  hint: {
    type: String,
    default: null
  },
  initialValue: {
    type: String,
    default: null
  },
  inputName: {
    type: String,
    default: 'emailAddress'
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Email Address'
  },
  placeholder: {
    type: String,
    default: 'Enter your email address...'
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

const checkMx = async emailAddress => {
  try {
    const result = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/v1/mail/check-mx/${emailAddress}`
    )
    const data = await result.json()
    const { mxExists } = data

    return mxExists ? true : false
  } catch (error) {
    console.log(error)
    return false
  }
}

const emitChange = () => {
  emits('changeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
}

const handleBlur = () => {
  handleChange()
}

const handleChange = async () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = await validate(inputValue.value)
  if (isValid.value) {
    errorMessages.value = ''
    validationStatus.value = null
  } else {
    errorMessages.value = props.errorMessage
    validationStatus.value = 'error'
  }
  emitChange()
}

const validate = async value => {
  const expression = /.+@.+\..+/i
  const isValidFormat = expression.test(String(value).toLowerCase())

  if (isValidFormat) {
    return await checkMx(value)
  } else {
    return false
  }
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
  <div class="input-email">
    <n-form-item
      :label="labeltext"
      :label-props="{ for: inputName }"
      :validation-status="validationStatus"
      :required="true"
    >
    <n-input
        v-model:value="inputValue"
        :placeholder="placeholder"
        :clearable="true"
        :input-props="{ name: inputName, id: inputName }"
        style="margin-bottom: 0.5rem"
        @blur="handleBlur"
      />
    </n-form-item>
  </div>
</template>
