<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required=true
  >
    <n-select
      :placeholder="placeholder"
      @blur="handleBlur"
      v-model:value="terrain"
      :options="options"
      style="margin-bottom: 0.5rem"
    />
  </n-form-item>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'

import { NFormItem, NSelect } from 'naive-ui'

export default defineComponent({
  components: { NFormItem, NSelect },
  props: {
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
  },
  setup (props, { emit }) {
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
      emitChange()
    })

    const emitChange = () => {
      emit('changeFormValues', { inputName: 'terrain', inputValue: terrain.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
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
    return {
      handleBlur,
      isValid,
      options,
      terrain,
      validate,
      validationStatus
    }
  }
})
</script>
