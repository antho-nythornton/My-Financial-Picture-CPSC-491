import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { AuthProvider } from '../src/context/AuthContext';

const renderWithRouterAndAuth = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
};

describe('FTest-05: Login Page Navigation', () => {
  it('allows user with valid credentials to access the dashboard', async () => {
    renderWithRouterAndAuth(<App />, { route: '/' });

    // Verify we're on the login page
    expect(
      screen.getByRole('heading', { level: 2, name: /login/i })
    ).toBeInTheDocument();

    // Enter valid email
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'testuser@example.com' },
    });

    // Enter valid password
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password123' },
    });

    // Click the Login button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for navigation and dashboard to appear
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });
});