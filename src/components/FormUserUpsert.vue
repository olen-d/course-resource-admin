<script setup>
import { computed, onMounted, ref } from 'vue'

import { useStore } from 'vuex'

import { NAlert, NButton, NForm, NResult } from 'naive-ui'

import { verifyBearerToken } from '@/services/jsonwebtoken.mjs'

import EnterPasswordModal from '@/components/EnterPasswordModal.vue'
import InputEmail from '@/components/form-fields/InputEmail.vue'
import InputName from '@/components/form-fields/InputName.vue'
import InputPassword from '@/components/form-fields/InputPassword.vue'
import InputUsername from '@/components/form-fields/InputUsername.vue'
import SelectGeneric from '@/components/form-fields/SelectGeneric.vue'

const store = useStore()

const props = defineProps({
  formAction: {
    type: String,
    default: 'add'
  },
  formName: {
    type: String,
    default: 'New User'
  },
  submitActionLabel: {
    type: String,
    default: 'Create User'
  },
  successAction: {
    type: String,
    default: 'created'
  },
  userId: {
    type: String
  }
})

const accessPublicKey = computed(() => store.state.accessPublicKey)
const accessToken = computed(() => store.state.accessToken)

const errorDescription = ref('')
const errorTitle = ref('')
const formValues = ref([])
const initialData = ref({})
const isSubmitted = ref(false)
const showErrorMessageBox = ref(false)
const showEnterPasswordModal = ref(false)
const showResult = ref(false)
const shouldClearInputs = ref(false)
const userIdCurrent = ref(null)

const optionsRole = [
  {
    label: 'Super Administrator',
    value: 'superadmin',
    description: ''
  },
  {
    label: 'Administrator',
    value: 'admin',
    description: ''
  },
  {
    label: 'Publisher',
    value: 'publisher',
    description: ''
  },
  {
    label: 'Editor',
    value: 'editor',
    description: ''
  },
  {
    label: 'Author',
    value: 'author',
    description: ''
  },
  {
    label: 'User',
    value: 'user',
    description: ''
  }
]

onMounted(async () => {
  if (props.formAction === 'edit') {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/v1/users/id/${props.userId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )
    const result = await response.json()
    const { status } = response

    if (status === 200) {
      const { data } = result
      initialData.value = data
    }
  const { payload: { sub }, } = await verifyAccessToken()
  userIdCurrent.value = sub
  }
})

const cancelUpsertUser = event => {
  const { userid } = event
  showEnterPasswordModal.value = false
}

const clearForm = () => {
  shouldClearInputs.value = true
}

const getFormErrors = () => {
  const formErrors = formValues.value.filter(element => {
    return element.isValid === false
  })
  return formErrors
}

const getFormErrorsChanged = () => {
  const formErrorsChanged = formValues.value.filter(element => {
    return element.isChanged === true && element.isValid === false
  })
  return formErrorsChanged
}

const handleVerifyPassword = async () => {
  showEnterPasswordModal.value = true
}

const handleSubmit = async event => {
  showEnterPasswordModal.value = false
  try {
    isSubmitted.value = true
    const formErrors = props.formAction === 'edit' ? getFormErrorsChanged() : getFormErrors()
    if (formErrors.length > 0) {
      updateFormErrors(formErrors)
    } else {

      // Submit
      const accessTokenResult = await verifyAccessToken()
      const response = props.formAction === 'edit' ? await patchFormData(accessTokenResult) : await postFormData(accessTokenResult)
      const { status, result, role } = response

      if (status === 200 && result.status === 'ok') {
        showResult.value = true
        clearForm()
      }
      // TODO: Finish the error handling to address all cases
      if (status === 400 && result.message) {
        errorDescription.value = 'One or more required fields were not submitted ot the server. Please try again in a few minutes.'
        const rolesAuthForDetailedError = ['superadmin', 'admin']
        if (rolesAuthForDetailedError.indexOf(role) !== -1) {
          errorDescription.value += ` Server response: ${result.message}`
        }
        errorTitle.value = 'Server Error'
        showErrorMessageBox.value = true
      } else if (status === 403 && result.message) {
        errorDescription.value = 'Unauthorized, the user was not created.'
        const rolesAuthForDetailedError = ['superadmin', 'admin', 'user']
        if (rolesAuthForDetailedError.indexOf(role) !== -1) {
          errorDescription.value += ` Server response: ${result.message}`
        }
        errorTitle.value = 'Server Error'
        showErrorMessageBox.value = true
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const patchFormData = async accessTokenResult => {
  const { payload: { role, sub: creatorId } } = accessTokenResult
  const data = {}
  formValues.value.forEach(element =>  {
    const { inputName, inputValue, isChanged } = element
      if (isChanged) { data[inputName] = inputValue }
  })

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/id/${props.userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const result = await response.json()
    const { status } = response
    return { status, result, role }
  } catch(error) {
    console.error(error)
    // TODO: return error in status, result.message format
  }
}

const postFormData = async accessTokenResult => {
  const { payload: { role, sub: creatorId } } = accessTokenResult
  const data = { creatorId, ownerId: creatorId, role: 'user' } // TODO: If creating a new user, set creatorId equal to ownerId, if editing a course use the settings from the DB also make the role users selectable for superadmin
  formValues.value.forEach(element => {
    const { inputName, inputValue } = element
    data[inputName] = inputValue
  })

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/user`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const result = await response.json()
    const { status } = response
    return { status, result, role }
  } catch(error) {
    console.error(error)
    // TODO: return error in status, result.message format
  }
}

const removeFormValues = event => {
  const { inputName: name } = event
  const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
  formValues.value.splice(valuesIndex, 1) // Mutates formValues
  if (formValues.value.length === 0) { shouldClearInputs.value = false }
}

const updateFormErrors = formErrors => {
  if (formErrors.length > 0) {
    const errorMessages = formErrors.map(element => {
      return element.errorMessage
    })
    errorDescription.value = errorMessages.join('. ') + '.'

    const numberAgreement = formErrors.length === 1 ? 'An Error' : 'Errors'
    errorTitle.value = `The ${props.formName} Form Has ${numberAgreement}`

    showErrorMessageBox.value = true
  } else {
    showErrorMessageBox.value = false
    errorDescription.value = ''
    errorTitle.value = ''
  }
}

const updateFormValues = event => {
  const { inputName: name } = event
  const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
  if (valuesIndex === -1) {
    formValues.value.push(event)
  } else {
    formValues.value[valuesIndex] = event
  }
  const formErrors = isSubmitted.value ? getFormErrors() : getFormErrorsChanged()
  updateFormErrors(formErrors)
}

const verifyAccessToken = async () => {
  try {
    const verifiedAccessToken = await verifyBearerToken(accessToken.value, accessPublicKey.value)
    return verifiedAccessToken
  } catch (error) {
    return false
  }
}

</script>

<template>
  <div class="form-user-upsert">
    <EnterPasswordModal 
      :show-modal="showEnterPasswordModal"
      @cancel-modal="cancelUpsertUser($event)"
      @change-form-values="updateFormValues($event)"
      @confirm-modal="handleSubmit($event)"
      @remove-form-values="removeFormValues($event)"
    />
    <n-alert
      v-if="showErrorMessageBox"
      :title="errorTitle"
      type="error"
      :show-icon="true"
      style="margin-bottom: 1.5rem; text-align: left"
    >
      {{ errorDescription }}
    </n-alert>
    <n-result
      v-if="showResult"
      status="success"
      title="Great Success"
      :description="'The user has been ' + successAction"
    />
    <n-form label-position="top">
      <InputUsername
        placeholder="Enter a username..."
        :initial-value="initialData.username"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <InputPassword
        v-if="(userIdCurrent === userId) || (formAction === 'add')"
        placeholder="Enter the user's password..."
        :required="false"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <InputEmail 
        placeholder="Enter the user's email address..."
        :initial-value="initialData.emailAddress"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <InputName
        errorMessage="Please enter a valid first name"
        inputName="firstName"
        labeltext="First Name"
        placeholder="Enter the users's first name..."
        :initial-value="initialData.firstName"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <InputName
        errorMessage="Please enter a valid last name"
        inputName="lastName"
        labeltext="Last Name"
        placeholder="Enter the users's last name..."
        :initial-value="initialData.lastName"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <SelectGeneric
        errorMessage="Please select a role"
        inputName="role"
        labeltext="Role"
        optionValue="user"
        placeholder="Select a role..."
        :initial-value="initialData.role"
        :options="optionsRole"
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <n-button
        type="primary"
        attr-type="submit"
        @click="handleVerifyPassword"
      >
        {{ props.submitActionLabel }}
      </n-button>
    </n-form>
    <pre>
{{ formValues }}
    </pre>
  </div>
</template>
