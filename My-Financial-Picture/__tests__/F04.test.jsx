import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import App from '../src/App'
import { AuthProvider } from '../src/context/AuthContext'

const { postMock } = vi.hoisted(() => ({ postMock: vi.fn() }))

vi.mock('../src/lib/api', () => ({
  default: { post: postMock },
}))

describe('FTest-04', () => {
  let alertSpy

  beforeEach(() => {
    localStorage.setItem('mfp_auth', JSON.stringify({ isAuthed: false, userId: null }))
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    postMock.mockReset()
  })

  afterEach(() => {
    alertSpy.mockRestore()
  })

  test('shows error and does not submit when password and confirm password mismatch', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/started']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: /get started/i })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/first name/i), 'Real')
    await user.type(screen.getByLabelText(/last name/i), 'Person')
    await user.type(screen.getByLabelText(/^email$/i), 'real.person@example.com')
    await user.type(screen.getByLabelText(/phone/i), '5551234567')
    await user.type(screen.getByLabelText(/^password$/i), 'SuperSecret123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'NotTheSame999!')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(alertSpy).toHaveBeenCalled()
    expect((alertSpy.mock.calls[0]?.[0] || '').toLowerCase()).toContain('passwords do not match')
    expect(postMock).not.toHaveBeenCalled()

    expect(screen.getByRole('heading', { level: 1, name: /get started/i })).toBeInTheDocument()
  })
})