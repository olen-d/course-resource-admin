import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/vue'
import InputUsername from '@/components/form-fields/InputUsername.vue'

test('default props render', async () => {
  render(InputUsername, { props: { } })

  expect(screen.getByLabelText('Username *')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your username...')).toBeTruthy()
})

test('passed props render', async () => {
  render(InputUsername, { props: { labeltext: 'Email Address', placeholder: 'Enter your email address...' } })

  expect(screen.getByLabelText('Email Address *')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your email address...')).toBeTruthy()
})
