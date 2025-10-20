import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, test } from 'vitest'
import App from '../src/App'
import { AuthProvider } from '../src/context/AuthContext'

describe('FTest-08', () => {
  beforeEach(() => {
    localStorage.setItem('mfp_auth', JSON.stringify({
      isAuthed: true, userId: 1, firstName: 'Test'
    }))
  })

  test('Clicking "Reports" shows the Reports page', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    )

    await user.click(screen.getByRole('link', { name: /reports/i }))
    expect(await screen.findByRole('heading', { name: /reports/i })).toBeInTheDocument()
  })
})