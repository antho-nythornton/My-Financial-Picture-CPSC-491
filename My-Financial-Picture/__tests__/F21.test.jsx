import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'

vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ userId: 42, firstName: 'Test' }),
}))

vi.mock('../src/lib/api', () => {
  const get = vi.fn((url) => {
    if (url.includes('/users/42/institutions')) {
      return Promise.resolve({
        data: [
          { id: 1, name: 'Checking', type: 'checking', balance: 0, currency: 'USD' },
          { id: 2, name: 'Savings',  type: 'savings',  balance: 0, currency: 'USD' },
        ],
      })
    }
    return Promise.resolve({ data: [] })
  })
  return { default: { get } }
})

import Accounts from '../src/pages/Accounts'

describe('FTest-21: Accounts defaults for new user', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => vi.clearAllMocks())

  test('renders Checking/Savings with 0 balances', async () => {
    render(<Accounts />)

    const checking = await screen.findByText(/checking/i)
    const savings  = await screen.findByText(/savings/i)
    expect(checking).toBeInTheDocument()
    expect(savings).toBeInTheDocument()

    const chkText = checking.closest('li')?.textContent ?? ''
    const savText = savings.closest('li')?.textContent ?? ''
    expect(chkText).toMatch(/0/)
    expect(savText).toMatch(/0/)
  })
})