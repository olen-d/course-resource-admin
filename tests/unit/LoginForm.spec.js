import { expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import LoginForm from '@/components/LoginForm.vue'

test('username, password, and sign in render', async () => {
  render(LoginForm)

  expect(screen.getByLabelText('Username *')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your username...')).toBeTruthy()
  expect(screen.getByLabelText('Password *')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your password...')).toBeTruthy()
  expect(screen.getByRole('button', { name: /sign {1}in/i })).toBeTruthy()

  cleanup()
})

test('error notification appears on invalid username or password', async () => {
  render(LoginForm, { props: { } })

  // No username or password
  await fireEvent.click(screen.getByRole('button', { name: /sign {1}in/i }))
  expect(screen.getByText('The Sign In Form Has Errors')).toBeTruthy()

  // No password
  // const usernameInput = screen.getByLabelText('Username *')
  // await fireEvent.update(usernameInput, 'Phil')
  // await fireEvent.click(screen.getByRole('button', { name: /sign {1}in/i }))
  // expect(screen.getByText('The Sign In Form Has an Error')).toBeTruthy()
  // expect(usernameInput._value).toEqual('Phil')

  // No username
  cleanup()
})

test('inputs update v-model', async () => {
  render(LoginForm)

  const passwordInput = screen.getByLabelText('Password *')
  const usernameInput = screen.getByLabelText('Username *')

  await fireEvent.update(passwordInput, 'p4ssword!')
  await fireEvent.update(usernameInput, 'Phil')

  expect(passwordInput._value).toEqual('p4ssword!')
  expect(usernameInput._value).toEqual('Phil')

  cleanup()
})
