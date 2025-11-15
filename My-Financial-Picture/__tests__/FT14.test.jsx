import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import App from '../src/App'
import { AuthProvider } from '../src/context/AuthContext'

// Mock API used by app initialization (if any)
vi.mock('../src/lib/api', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}))

describe('FT14 - Settings navigation', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('mfp_auth', JSON.stringify({ isAuthed: true, userId: 42, firstName: 'Test' }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderAppAt = (path = '/dashboard') => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    )
  }

  test('shows Settings page when settings icon is clicked from a protected page', async () => {
    const user = userEvent.setup()
    renderAppAt('/dashboard')

    // Ensure we're on the dashboard (or another protected page) before clicking
    await waitFor(() => expect(screen.getByText(/Home|Dashboard/i)).toBeInTheDocument())

    // Click the settings icon in the navbar (aria-label="Settings")
    const settingsButton = screen.getByRole('button', { name: /Settings/i })
    await user.click(settingsButton)

    // Expect Settings page to be visible
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Settings/i })).toBeInTheDocument()
      // also check presence of a known Settings element
      expect(screen.getByText(/Theme:/i)).toBeInTheDocument()
    })
  })
})
