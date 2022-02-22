<template>
  <div class="the-upload-files-course">
    <p>
      Add Course Files
    </p>
    <n-button
      :disabled="!fileListLength"
      @click="handleClick"
      style="margin-bottom: 0.5rem"
    >
      Upload File
    </n-button>
    <n-upload
      @change="handleChange"
      :action="actionURL"
      :default-upload="false"
      :headers="headers"
      multiple
      ref="upload"
    >
      <n-button>Select File</n-button>
    </n-upload>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch } from 'vue'

import { NButton, NUpload } from 'naive-ui'

import Store from '../store'

export default defineComponent({
  components: { NButton, NUpload },
  setup (props, { emit }) {
    const { state: { accessToken } } = Store

    const actionURL = computed(() => `${process.env.VUE_APP_API_BASE_URL}/v1/courses/files`)
    const headers = computed(() => { return { Authorization: `Bearer ${accessToken}` } })
    const changedState = { isChanged: false }
    const errorMessage = 'Please choose at least one file to upload'
    const fileListLength = ref(0)
    const isValid = ref(false)
    const upload = ref(null)

    onMounted(() => {
      emitChange()
    })

    const emitChange = (fileNames) => {
      emit('changeFormValues', { inputName: 'uploadFilesCourse', inputValue: fileNames, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
    }

    const handleChange = ({ fileList }) => {
      if (!changedState.isChanged) {
        changedState.isChanged = true
      }
      const fileNames = fileList.map(element => {
        return element.name
      })

      fileListLength.value = fileList.length
      isValid.value = validate()
      emitChange(fileNames)
    }

    const handleClick = () => {
      upload.value.submit()
    }

    const validate = () => {
      const isValid = fileListLength.value > 0
      return isValid
    }

    watch(() => props.isServerError, (isServerError, prevIsServerError) => {
      if (isServerError) {
        // validationStatus.value = 'error'
        isValid.value = false
        emitChange()
      }
    })

    return {
      actionURL,
      fileListLength,
      handleChange,
      handleClick,
      headers,
      upload
    }
  }
})
</script>
