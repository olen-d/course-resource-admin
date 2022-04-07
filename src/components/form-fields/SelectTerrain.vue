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
    default: 'Terrain'
  },
  placeholder: {
    type: String,
    default: 'Select a type of terrain...'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please select a valid terrain'
const isValid = ref(false)
const terrain = ref('')
const options = [
  {
    label: 'Flat',
    value: 'flat',
    description: ''
  },
  {
    label: 'Rolling Hills',
    value: 'rolling hills',
    description: ''
  },
  {
    label: 'Hills',
    value: 'hills',
    description: ''
  },
  {
    label: 'Mountains',
    value: 'mountains',
    description: ''
  }
]
const validationStatus = ref('')

onMounted(() => {
  terrain.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'terrain', inputValue: terrain.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(terrain.value)
  validationStatus.value = isValid.value ? null : 'error'
  emitChange()
}

const validate = terrain => {
  const isValid = typeof terrain === 'string' && terrain.length > 0
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
      v-model:value="terrain"
      :placeholder="placeholder"
      :options="options"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
