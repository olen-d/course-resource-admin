<script setup>
import { ref, watch } from 'vue'

import {NModal } from 'naive-ui'

import InputPassword from '@/components/form-fields/InputPassword.vue'

const props = defineProps({
  modalTitle: {
    type: String,
    default: 'Please Enter Your Password to Proceed'
  },
  showModal: {
    type: Boolean,
    default: false
  },
  userid: {
    type: String,
  }
})

const shouldClearInputPassword = ref(false)
const shouldShowModal = ref(props.showModal)

const emits = defineEmits(['cancelModal', 'confirmModal', 'removeFormValues', 'changeFormValues'])

const cancelAction = () => {
  shouldClearInputPassword.value = true
  emits('cancelModal', { userid: props.userid })
}

const changeFormValues = event => {
  emits('changeFormValues', event)
}

const removeFormValues = event => {
  shouldClearInputPassword.value = false
  emits('removeFormValues', event)
}

const submitAction = () => {
  emits('confirmModal', { userid: props.userid })
}

watch(() => props.showModal, (newShowModal, prevShowModal) => {
  shouldShowModal.value = newShowModal
})
</script>

<template>
  <div class="enter-password-modal">
    <n-modal
      v-model:show="shouldShowModal"
      preset="dialog"
      type="warning"
      :closable="false"
      :title="modalTitle"
      positive-text="Submit"
      negative-text="Cancel"
      @positive-click="submitAction"
      @negative-click="cancelAction"
    >
      <InputPassword
        input-name="plaintextPasswordRe"
        labeltext=""
        :shouldClearInput="shouldClearInputPassword"
        @change-form-values="changeFormValues($event)"
        @remove-form-values="removeFormValues($event)"  
      />
    </n-modal>
  </div>
</template>
