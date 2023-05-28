<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInput } from 'naive-ui'

const emits = defineEmits(['changeFormValues'])

const props = defineProps({
  errorMessage: {
    type: String,
    default: 'Please enter a valid title'
  },
  initialValue: {
    type: String,
    default: null
  },
  inputName: {
    type: String,
    default: 'title'
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Title'
  },
  placeholder: {
    type: String,
    default: 'Enter a title...'
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

const changedState = { isChanged: false }
const errorMessages = ref('')
const isValid = ref(false)
const slug = ref('')
const inputValue = ref('')
const validationStatus = ref('')

onMounted(() => {
  inputValue.value = props.initialValue
  emitChange(props.inputName, inputValue.value)
  emitChange('slug', slug.value)
})

const createSlug = value => {
  const stopWords = [
    'a',
    'after',
    'along',
    'an',
    'and',
    'around',
    'at',
    'but',
    'by',
    'for',
    'from',
    'nor',
    'of',
    'on',
    'or',
    'so',
    'the',
    'to',
    'with',
    'without',
    'yet'
  ]
  const stopWordsBoundaries = stopWords.map(element => {
    return `\\b${element}\\b` // Need to escape \ because a constructor function is used later
  })
  const specialCharactersRemoved = value.replace(/[^a-zA-Z0-9 ]/g, '')
  const stopWordsRegEx = new RegExp(stopWordsBoundaries.join('|'), 'gi')
  const stopWordsRemoved = specialCharactersRemoved.replace(stopWordsRegEx, '')
  const stopWordsRemovedTrimmed = stopWordsRemoved.trim()
  const extraSpacesRemoved = stopWordsRemovedTrimmed.replace(/ +/g, ' ')
  const spacesToHyphens = extraSpacesRemoved.replace(/ /g, '-')
  const slug = spacesToHyphens.toLowerCase()
  return slug
}

const emitChange = (name, value) => {
  emits('changeFormValues', { inputName: name, inputValue: value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
}

const handleBlur = () => {
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
  slug.value = createSlug(inputValue.value)
  emitChange(props.inputName, inputValue.value)
  emitChange('slug', slug.value)
}

const validate = value => {
  const alphaNumericPunctuation = /^[a-zA-Z0-9-]+[!?.]*(,? [a-zA-Z0-9-]+[!?.]*)*$/
  const isValid = alphaNumericPunctuation.test(value)
  return isValid
}

watch(() => props.isServerError, (newIsServerError, prevIsServerError) => {
  if (newIsServerError) {
    changedState.isChanged = true
    errorMessages.value = props.errorMessage
    validationStatus.value = 'text-error'
    isValid.value = false
    emitChange(props.inputName, inputValue.value)
    emitChange('slug', slug.value)
  }
})
</script>

<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="required"
  >
    <n-input
      v-model:value="inputValue"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
