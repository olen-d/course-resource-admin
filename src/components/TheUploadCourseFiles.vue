<template>
  <div class="the-upload-course-files">
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
      action="https://"
      :default-upload="false"
      multiple
      ref="upload"
    >
      <n-button>Select File</n-button>
    </n-upload>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

import { NButton, NUpload } from 'naive-ui'

export default defineComponent({
  components: { NButton, NUpload },
  setup () {
    const fileListLength = ref(0)
    const upload = ref(null)

    const handleChange = ({ fileList }) => {
      fileListLength.value = fileList.length
    }

    const handleClick = () => {
      upload.value.submit()
    }

    return {
      fileListLength,
      handleChange,
      handleClick,
      upload
    }
  }
})
</script>
