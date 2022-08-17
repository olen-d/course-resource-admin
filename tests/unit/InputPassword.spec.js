import { expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import InputPassword from '@/components/form-fields/InputPassword.vue'

test('default props render', async () => {
  render(InputPassword, { props: { } })

  expect(screen.getByLabelText('Password *')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your password...')).toBeTruthy()

  cleanup()
})

test('passed props render', async () => {
  render(InputPassword, { props: { labeltext: 'Secret Code', placeholder: 'Enter your six digit code...' } })

  expect(screen.getByLabelText('Secret Code *')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your six digit code...')).toBeTruthy()

  cleanup()
})

test('input updates v-model', async () => {
  render(InputPassword)

  const input = screen.getByLabelText('Password *')
  await fireEvent.update(input, 'isot43U!')

  expect(input._value).toEqual('isot43U!')
})
