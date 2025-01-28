<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NSwitch } from 'naive-ui'

const emits = defineEmits(['changeFormValues'])

const props = defineProps({
  initialValue: {
    type: Boolean,
    default: false
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Published'
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid published value'
const isPublished = ref(false)
const isValid = ref(false)
const validationStatus = ref('')

onMounted(() => {
  isPublished.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'isPublished', inputValue: isPublished.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
}

const handleUpdate = (value) => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  isValid.value = validate(value)
  validationStatus.value = isValid.value ? null : 'error'
  isPublished.value = value
  emitChange()
}

const validate = isPublished => {
  const isValid = typeof isPublished === 'boolean'
  return isValid
}

watch(() => props.initialValue, (initialValue, prevInitialValue) => {
  isPublished.value = initialValue
  emitChange()
})

watch(() => props.isServerError, (isServerError, prevIsServerError) => {
  if (isServerError) {
    validationStatus.value = 'error'
    isValid.value = false
    emitChange()
  }
})
</script>

<template>
  <div class="switch-is-published">
    <n-form-item
      :label="labeltext"
      :validation-status="validationStatus"
      :required="true"
    >
      <n-switch
        v-model:value="isPublished"
        style="margin-bottom: 0.5rem"
        @update:value="handleUpdate"
      />
    </n-form-item>
  </div>
</template>
