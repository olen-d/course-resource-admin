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
    default: 'Title'
  },
  placeholder: {
    type: String,
    default: 'Enter a title...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid title'
const isValid = ref(false)
const slug = ref('')
const title = ref('')
const validationStatus = ref('')

onMounted(() => {
  title.value = props.initialValue
  emitChange('title', title.value)
  emitChange('slug', slug.value)
})

const createSlug = title => {
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
  const specialCharactersRemoved = title.replace(/[^a-zA-Z0-9 ]/g, '')
  const stopWordsRegEx = new RegExp(stopWordsBoundaries.join('|'), 'gi')
  const stopWordsRemoved = specialCharactersRemoved.replace(stopWordsRegEx, '')
  const stopWordsRemovedTrimmed = stopWordsRemoved.trim()
  const extraSpacesRemoved = stopWordsRemovedTrimmed.replace(/ +/g, ' ')
  const spacesToHyphens = extraSpacesRemoved.replace(/ /g, '-')
  const slug = spacesToHyphens.toLowerCase()
  return slug
}

const emitChange = (name, value) => {
  const isValidValue = name === 'title' ? isValid.value : true
  const errorMessageValue = name === 'title' ? errorMessage : null
  emits('changeFormValues', { inputName: name, inputValue: value, isChanged: changedState.isChanged, isValid: isValidValue, errorMessage: errorMessageValue })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(title.value)
  validationStatus.value = isValid.value ? null : 'error'
  slug.value = createSlug(title.value)
  emitChange('title', title.value)
  emitChange('slug', slug.value)
}

const validate = title => {
  const alphaNumericPunctuation = /^[a-zA-Z0-9-]+[!?.]*(,? [a-zA-Z0-9-]+[!?.]*)*$/
  const isValid = alphaNumericPunctuation.test(title)
  return isValid
}

watch(() => props.isServerError, (isServerError, prevIsServerError) => {
  if (isServerError) {
    validationStatus.value = 'error'
    isValid.value = false
    emitChange('title', title.value)
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
      v-model:value="title"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
