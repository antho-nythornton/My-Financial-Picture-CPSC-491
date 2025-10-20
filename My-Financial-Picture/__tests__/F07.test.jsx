import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, test } from 'vitest'
import App from '../src/App'
import { AuthProvider } from '../src/context/AuthContext'

describe('FTest-07', () => {
  beforeEach(() => {
    localStorage.setItem('mfp_auth', JSON.stringify({
      isAuthed: true, userId: 1, firstName: 'Test'
    }))
  })

  test('Clicking "Bills" shows the Bills page', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    )

    await user.click(screen.getByRole('link', { name: /bills/i }))
    expect(await screen.findByRole('heading', { name: /bills/i })).toBeInTheDocument()
  })
})