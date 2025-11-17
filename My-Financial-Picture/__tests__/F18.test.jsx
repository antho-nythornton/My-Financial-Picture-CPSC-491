import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import App from '../src/App'
import { AuthProvider } from '../src/context/AuthContext'

vi.mock('../src/lib/api', () => {
  const get = vi.fn((url) => {
    if (url.includes('/users/42/needs-quickstart')) {
      return Promise.resolve({
        data: {
          user_id: 42,
          needs_quickstart: true,
          counts: { institutions: 0, budgets: 0, goals: 0 },
          missing: { institutions: true, budgets: true, goals: true },
        },
      })
    }
    if (url.includes('/users/42/summary')) {
      return Promise.resolve({
        data: {
          total_balance: 0,
          month_income: 0,
          month_spent: 0,
          budget_limit: null,
          budget_spent: 0,
          budget_progress: 0,
        },
      })
    }
    return Promise.resolve({ data: [] })
  })

  const post = vi.fn((url) => {
    if (url === '/login') {
      return Promise.resolve({
        data: {
          message: 'Login successful',
          user_id: 42,
          first_name: 'Test',
          last_name: 'User',
        },
      })
    }
    return Promise.reject(new Error(`Unexpected API call: ${url}`))
  })

  return { default: { get, post } }
})

describe('FTest-18: Dashboard opens Quickstart on first load', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.clearAllMocks())

  test('Quickstart step 1 appears over Dashboard after login', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/email/i), 'testuser@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/hi,\s*test/i)).toBeInTheDocument()
    })

    expect(
      await screen.findByRole('heading', { name: /bank & accounts/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/let’s set up a few basics/i)).toBeInTheDocument()
  })
})