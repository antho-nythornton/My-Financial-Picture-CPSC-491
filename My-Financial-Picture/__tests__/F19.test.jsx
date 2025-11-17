import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import React from 'react'

vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ userId: 42, firstName: 'Test' }),
}))

vi.mock('../src/lib/api', () => ({ default: { post: vi.fn(), get: vi.fn() } }))

import Quickstart from '../src/components/Quickstart'

describe('FTest-19: Quickstart next step', () => {
  test('step 1 -> step 2 on Next', async () => {
    const user = userEvent.setup()

    render(
      <Quickstart
        open={true}
        initialStep={1}
        onSaved={() => {}}
        onClose={() => {}}
      />
    )

    expect(
      await screen.findByRole('heading', { name: /bank & accounts/i })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(
      await screen.findByRole('heading', { name: /income & budget/i })
    ).toBeInTheDocument()
  })
})