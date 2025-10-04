import {Link, useNavigate} from 'react-router-dom'
import React, {useState}  from 'react'
import './Login.css'
import api from './lib/api';
import { useAuth } from './context/AuthContext'

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/login', { email, password });
      login({ userId: res.data.user_id });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container">
      <h1>My Financial Picture</h1>
      <h2>Login</h2>
      <form className="Login-container" onSubmit={handleLogin}>
        <div className="login">
          <label htmlFor="email" style={{ color: 'black' }}>Email</label><br />
          <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
          <label htmlFor="password" style={{ color: 'black' }}>Password</label><br />
          <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
        </div>
        <button id="submitButton" type="submit">
          Login
        </button>
        <div className="container-link">
          <Link to="/started">Create an account</Link>
        </div>
        <div className="container-link">
          <Link to="/reset_password">Forgot Password?</Link>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Login