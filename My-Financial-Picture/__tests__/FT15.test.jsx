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

describe('FT15 - Settings functionality', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('mfp_auth', JSON.stringify({ isAuthed: true, userId: 42, firstName: 'Test' }))
  })

  afterEach(() => {
    vi.clearAllMocks()
    try { vi.restoreAllMocks() } catch {}
  })

  const renderAppAt = (path = '/settings') => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    )
  }

  test('user can view and change settings and saved settings persist to localStorage', async () => {
    const user = userEvent.setup()
    renderAppAt('/settings')

    // Ensure settings page loaded
    await waitFor(() => expect(screen.getByRole('heading', { name: /Settings/i })).toBeInTheDocument())

    // Verify default values
    const themeSelect = screen.getByLabelText(/Theme/i)
    const currencySelect = screen.getByLabelText(/Currency/i)
    const notificationsCheckbox = screen.getByLabelText(/Enable Notifications/i)
    const autoSaveCheckbox = screen.getByLabelText(/Auto-Save/i)

    expect(themeSelect.value).toBe('light')
    expect(currencySelect.value).toBe('USD')
    expect(notificationsCheckbox.checked).toBe(true)
    expect(autoSaveCheckbox.checked).toBe(true)

    // Change settings
    await user.selectOptions(currencySelect, 'EUR')
    await user.click(notificationsCheckbox) // toggle off
    await user.click(autoSaveCheckbox) // toggle off

    expect(currencySelect.value).toBe('EUR')
    expect(notificationsCheckbox.checked).toBe(false)
    expect(autoSaveCheckbox.checked).toBe(false)

    // Spy on alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Click Save
    const saveButton = screen.getByRole('button', { name: /Save Settings/i })
    await user.click(saveButton)

    // Assert alert called and settings written to localStorage
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Settings saved successfully!')
      const raw = localStorage.getItem('appSettings')
      expect(raw).not.toBeNull()
      const parsed = JSON.parse(raw)
      expect(parsed.currency).toBe('EUR')
      expect(parsed.notifications).toBe(false)
      expect(parsed.autoSave).toBe(false)
    })

    alertSpy.mockRestore()
  })
})
