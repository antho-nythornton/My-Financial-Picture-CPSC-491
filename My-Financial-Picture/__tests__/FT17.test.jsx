import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
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

describe('FT17 - Notifications interactions', () => {
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

  test('user can mark a notification as read', async () => {
    const user = userEvent.setup()
    renderAppAt('/dashboard')

    // Open notifications
    const notifButton = screen.getByRole('button', { name: /^Notifications$/i })
    await user.click(notifButton)

    await waitFor(() => expect(screen.getByRole('heading', { name: /Notifications/i })).toBeInTheDocument())

    // Find notification list items and locate the Budget Alert item
    const listItems = screen.getAllByRole('listitem')
    const budgetItem = listItems.find((li) => within(li).queryByRole('heading', { name: /Budget Alert/i }))
    expect(budgetItem).toBeTruthy()

    // Click "Mark as read" and expect the item to have "read" class
    const markBtn = within(budgetItem).getByRole('button', { name: /Mark as read/i })
    await user.click(markBtn)

    await waitFor(() => expect(budgetItem).toHaveClass('read'))
  })

  test('user can delete a notification', async () => {
    const user = userEvent.setup()
    renderAppAt('/dashboard')

    // Open notifications
    const notifButton = screen.getByRole('button', { name: /^Notifications$/i })
    await user.click(notifButton)

    await waitFor(() => expect(screen.getByRole('heading', { name: /Notifications/i })).toBeInTheDocument())

    // Find the Payment Due item
    const listItems = screen.getAllByRole('listitem')
    const paymentItem = listItems.find((li) => within(li).queryByRole('heading', { name: /Payment Due/i }))
    expect(paymentItem).toBeTruthy()

    // Click Delete and expect it to be removed from the DOM
    const deleteBtn = within(paymentItem).getByRole('button', { name: /Delete/i })
    await user.click(deleteBtn)

    await waitFor(() => expect(screen.queryByText(/Payment Due/i)).not.toBeInTheDocument())
  })
})
