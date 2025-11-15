import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import App from '../src/App'
import { AuthProvider } from '../src/context/AuthContext'

vi.mock('../src/lib/api', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}))

describe('FT16 - Notifications page (view only)', () => {
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

  test('shows notifications page when notifications icon is clicked', async () => {
    const user = userEvent.setup()
    renderAppAt('/dashboard')

    const notifButton = screen.getByRole('button', { name: /^Notifications$/i })
    await user.click(notifButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Notifications/i })).toBeInTheDocument()
    })
  })
})
