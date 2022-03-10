<template>
  <div class="switch-is-published">
    <n-form-item
      :label="labeltext"
      :validation-status="validationStatus"
      :required="true"
    >
      <n-switch
        @update:value="handleUpdate"
        v-model:value="active"
        style="margin-bottom: 0.5rem"
      >
      </n-switch>
    </n-form-item>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'

import { NFormItem, NSwitch } from 'naive-ui'

export default defineComponent({
  components: { NFormItem, NSwitch },
  props: {
    isServerError: {
      type: Boolean,
      default: false
    },
    labeltext: {
      type: String,
      default: 'Published'
    }
  },
  setup (props, { emit }) {
    const active = ref(false)
    const changedState = { isChanged: false }
    const errorMessage = 'Please enter a valid published value'
    const isPublished = ref(false)
    const isValid = ref(false)
    const validationStatus = ref('')

    onMounted(() => {
      emitChange()
    })

    const emitChange = () => {
      emit('changeFormValues', { inputName: 'isPublished', inputValue: isPublished.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
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

    watch(() => props.isServerError, (isServerError, prevIsServerError) => {
      if (isServerError) {
        validationStatus.value = 'error'
        isValid.value = false
        emitChange()
      }
    })

    return {
      active,
      isPublished,
      handleUpdate,
      validationStatus
    }
  }
})
</script>
