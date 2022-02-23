<template>
  <div class="input-date-time">
    <n-form-item
      :label="labeltext"
      :validation-status="validationStatus"
      :required="true"
    >
      <n-date-picker
        @blur="handleBlur"
        v-model:value="timestamp"
        type="datetime"
        :clearable="true"
        style="margin-bottom: 0.5rem"
      >
      </n-date-picker>
    </n-form-item>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'

import { NDatePicker, NFormItem } from 'naive-ui'

export default defineComponent({
  components: { NDatePicker, NFormItem },
  props: {
    isServerError: {
      type: Boolean,
      default: false
    },
    labeltext: {
      type: String,
      default: 'Publish On'
    }
  },
  setup (props, { emit }) {
    const changedState = { isChanged: false }
    const errorMessage = 'Please enter a valid date and time'
    const isValid = ref(false)
    const timestamp = ref(Date.now())
    const validationStatus = ref('')

    onMounted(() => {
      emitChange()
    })

    const emitChange = () => {
      emit('changeFormValues', { inputName: 'timestamp', inputValue: timestamp.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
    }

    const handleBlur = () => {
      if (!changedState.isChanged) {
        changedState.isChanged = true
      }
      isValid.value = validate(timestamp.value)
      validationStatus.value = isValid.value ? null : 'error'
      emitChange()
    }

    const validate = timestamp => {
      const isValid = timestamp >= 0
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
      handleBlur,
      timestamp,
      validationStatus
    }
  }
})
</script>
