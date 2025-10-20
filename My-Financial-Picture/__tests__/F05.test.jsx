import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import App from '../src/App'
import { AuthProvider } from '../src/context/AuthContext'

vi.mock('../src/lib/api', () => {
  return {
    default: {
      post: vi.fn((url) => {
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
      }),
    },
  }
})

describe('FTest-05', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('allows user with valid credentials to access the dashboard', async () => {
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
  })
})