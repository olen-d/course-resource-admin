import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/vue'
import InputUsername from '@/components/form-fields/InputUsername.vue'

test('default prop label renders', async () => {
  render(InputUsername)

  expect(screen.getByLabelText('Username *')).toBeTruthy()
})

test('label passed as prop renders', async () => {
  render(InputUsername, { props: { labeltext: 'Email Address' } })

  expect(screen.getByLabelText('Email Address *')).toBeTruthy()
})
