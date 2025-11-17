import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import App from '../src/App'
import { AuthProvider } from '../src/context/AuthContext'

vi.mock('../src/lib/api', () => ({ default: { get: vi.fn(), post: vi.fn() } }))

describe('FTest-20: Protected routes redirect anonymous users', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.clearAllMocks())

  test('navigating to /dashboard redirects to Login', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    )

    expect(
      await screen.findByRole('button', { name: /login/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })
})