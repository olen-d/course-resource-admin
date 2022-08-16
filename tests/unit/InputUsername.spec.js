import { expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import InputUsername from '@/components/form-fields/InputUsername.vue'

test('default props render', async () => {
  render(InputUsername, { props: { } })

  expect(screen.getByLabelText('Username *')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your username...')).toBeTruthy()

  cleanup()
})

test('passed props render', async () => {
  render(InputUsername, { props: { labeltext: 'Email Address', placeholder: 'Enter your email address...' } })

  expect(screen.getByLabelText('Email Address *')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your email address...')).toBeTruthy()

  cleanup()
})

test('input updates v-model', async () => {
  render(InputUsername)

  const input = screen.getByLabelText('Username *')
  await fireEvent.update(input, 'Fred')

  expect(input._value).toEqual('Fred')
})
