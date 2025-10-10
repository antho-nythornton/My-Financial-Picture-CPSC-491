import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../src/Login';
import { AuthProvider } from '../src/context/AuthContext';

const renderWithRouterAndAuth = (ui) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Login Page Validation', () => {
  test('does not allow submission when both fields are empty', () => {
    renderWithRouterAndAuth(<Login />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });

  test('does not allow submission when email field is empty', () => {
    renderWithRouterAndAuth(<Login />);

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('mypassword');
  });

  test('does not allow submission when password field is empty', () => {
    renderWithRouterAndAuth(<Login />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('');
  });

  test('allows submission when both fields are filled', () => {
    renderWithRouterAndAuth(<Login />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('mypassword');
  });
});
