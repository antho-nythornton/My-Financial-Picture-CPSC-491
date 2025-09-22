import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect } from 'vitest'
import '@testing-library/jest-dom'
import App from '../src/App'

describe('Auth navigation', () => {
  test('Clicking "Create an account" goes to Started page', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { level: 2, name: /login/i })
    ).toBeInTheDocument()

    // Click "Create an account"
    await userEvent.click(screen.getByText(/create an account/i))

    // Should land on Started page
    expect(
      screen.getByRole('heading', { level: 1, name: /get started/i })
    ).toBeInTheDocument()
  })

  test('Clicking "Continue to Login Page" goes back to Login page', async () => {
    render(
      <MemoryRouter initialEntries={['/started']}>
        <App />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/sign up for a free account/i)
    ).toBeInTheDocument()

    // Click "Continue to Login Page"
    await userEvent.click(screen.getByText(/continue to login page/i))

    // Should land back on login page (again, be specific)
    expect(
      screen.getByRole('heading', { level: 2, name: /login/i })
    ).toBeInTheDocument()
  })
})
