
<script setup>
import InputPassword from '@/components/form-fields/InputPassword.vue'
import InputUsername from '@/components/form-fields/InputUsername.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { NAlert, NButton, NForm } from 'naive-ui'

import { verifyBearerToken } from '@/services/jsonwebtoken.mjs'

const router = useRouter()
const store = useStore()
const changeAccessToken = newBearerToken => store.commit('changeAccessToken', newBearerToken)
const changeAccessPublicKey = newAccessPublicKey => store.commit('changeAccessPublicKey', newAccessPublicKey)
const changeRefreshToken = newRefreshToken => store.commit('changeRefreshToken', newRefreshToken)

const errorDescription = ref('')
const errorTitle = ref('')
const formValues = ref([])
const isPlaintextPasswordError = ref(false)
const isUsernameError = ref(false)
const showErrorMessageBox = ref(false)

const updateFormInfo = (name, formValue) => {
  const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
  if (valuesIndex === -1) {
    formValues.value.push(formValue)
  } else {
    formValues.value[valuesIndex] = formValue
  }

  if (showErrorMessageBox.value) { validateForm() }
  // TODO: Check formErrors for true, if found, disable the submit button, otherwise enable the submit button
}
const handleSubmit = async () => {
  const validateResults = (validateForm())
  if (validateResults.length === 0) {
    const data = {}
    formValues.value.forEach(element => {
      const { inputName, inputValue } = element
      data[inputName] = inputValue
    })
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/auth/token/grant-type/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      const { status } = response

      // Check that all required properties were submitted
      if (status === 400 && result.message) {
        setErrorMessageContent('server', 'One or more required fields were not submitted ot the server. Please try again in a few minutes.')
        showErrorMessageBox.value = true
      }
      if (result && result.status === 'error') {
        const { type } = result
        switch (status) {
          case 400:
            if (type === 'validation') {
              const { validationResults: [{ isValid: isValidPlaintextPassword }, { isValid: isValidUsername }] } = result
              isPlaintextPasswordError.value = !isValidPlaintextPassword
              isUsernameError.value = !isValidUsername
              showErrorMessageBox.value = true
            }
            break
          case 404:
            isPlaintextPasswordError.value = true
            isUsernameError.value = true
            showErrorMessageBox.value = true
            break
          case 503:
            setErrorMessageContent('server', 'Something went wrong with the server. Please try again in a few minutes.')
            showErrorMessageBox.value = true
            break
          default:
            setErrorMessageContent('server', 'Something went wrong with the server. Please try again in a few minutes.')
            showErrorMessageBox.value = true
            break
        }
      } else if (result && result.status === 'created') {
        // Get the public key to verify the token
        const responsePublicKey = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/auth/token/public-key`)
        const resultPublicKey = await responsePublicKey.json()
        const { status } = responsePublicKey

        if (status === 200) {
          const { data: { publicKey } } = resultPublicKey
          const { data: { accessToken, refreshToken, tokenType } } = result

          changeAccessPublicKey(publicKey)
          if (tokenType === 'bearer') {
            changeAccessToken(accessToken)
            changeRefreshToken(refreshToken)
            const token = await verifyBearerToken(accessToken, publicKey)
            if (token) {
              router.push({ name: 'AdminDashboard' })
            } // An unverified token will throw and error that will get caught in the catch block
          }
        } else {
          // Fail - TODO: this should be some kind of generic catch-all, since the status should either be created or error
        }
      }
    } catch (error) {
      console.log(`\nERROR:\n(LoginForm.vue)\n${JSON.stringify(error, null, 2)}\n\n`)
      // Check for JsonWebTokenError
      if (error.name === 'JsonWebTokenError') {
        setErrorMessageContent('jsonwebtoken', 'Unable to authorize user. Please try again in a few minutes.')
      } else {
        setErrorMessageContent('noResponse', 'The server is unavailable. Please try again in a few minutes.')
      }
      showErrorMessageBox.value = true
    }
  }
}

const setErrorMessageContent = (type, formErrors) => {
  switch (type) {
    case 'form': {
      const errorAgreement = formErrors.length > 1 ? 'Errors' : 'an Error'
      errorTitle.value = `The Sign In Form Has ${errorAgreement}`
      const errorMessages = formErrors.map(element => {
        return element.errorMessage
      })
      errorDescription.value = errorMessages.join('. ') + '.'
      break
    }
    case 'jsonwebtoken':
      errorTitle.value = 'Authorization Failed'
      errorDescription.value = formErrors
      break
    case 'server':
      errorTitle.value = 'Sign In Failed'
      errorDescription.value = formErrors
      break
    case 'noResponse':
      errorTitle.value = 'Failed to Connect'
      errorDescription.value = formErrors
      break
    default:
      break
  }
}

const validateForm = () => {
  let formErrors = []
  formErrors = formValues.value.filter(element => {
    return element.isValid === false
  })
  if (formErrors.length > 0) {
    setErrorMessageContent('form', formErrors)
    showErrorMessageBox.value = true
  } else {
    showErrorMessageBox.value = false
    isPlaintextPasswordError.value = false
    isUsernameError.value = false
  }
  return formErrors
}
</script>

<template>
  <div class="login-form">
    <h1>Sign In</h1>
    <n-alert
      v-if="showErrorMessageBox"
      :title="errorTitle"
      type="error"
      :show-icon="true"
      :closable="true"
      style="margin-bottom: 1.5rem; text-align: left"
    >
      {{ errorDescription }}
    </n-alert>
    <n-form label-placement="top">
      <InputUsername
        :is-server-error="isUsernameError"
        labeltext="Username"
        placeholder="Enter your username..."
        @change-form-values="updateFormInfo('username', $event)"
      />
      <InputPassword
        :is-server-error="isPlaintextPasswordError"
        labeltext="Password"
        placeholder="Enter your password..."
        @change-form-values="updateFormInfo('plaintextPassword', $event)"
      />
    </n-form>
    <n-button
      type="primary"
      attr-type="submit"
      @click="handleSubmit"
    >
      Sign In
    </n-button>
  </div>
</template>
