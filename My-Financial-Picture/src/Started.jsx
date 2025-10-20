import { useState } from "react";
import './Started.css';
import {Link, useNavigate} from 'react-router-dom';
import api from './lib/api';


function getErrMsg(err) {
  const d = err?.response?.data
  if (Array.isArray(d?.detail)) return d.detail.map(e => e.msg).join('\n')
  if (typeof d?.detail === 'string') return d.detail
  if (typeof d?.message === 'string') return d.message
  return err?.message || 'Registration failed'
}

function Started() {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    try {
      setIsSubmitting(true)

      await api.post('/register', {
        email: email.trim().toLowerCase(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone,
      });
      alert('Account created successfully!')
      navigate('/', { replace: true })
    } catch (err) {
      alert(`Error: ${getErrMsg(err)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
    <div className="container">
      <h1>Get Started</h1>
      <p>Sign Up for a free account</p><br /><br />
      <form className="SignUp-container" onSubmit={handleSubmit}>
        <div className="SignUp">
          <div className="password-container">
            <div className="password-field">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="password-field">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <label htmlFor="emailprompt" >Email</label>
          <input className="email-field" type="email" id="emailprompt" maxLength={72} placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="password-container">
            <div className="password-field">
              <label htmlFor="password">Password</label>
              <input className="password-field" type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}required/>
            </div>
            <div className="password-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" placeholder="Enter your password" value={confirmPassword}onChange={(e) => setConfirmPassword(e.target.value)} required/>
            </div>
          </div>
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" placeholder="(123) - 456 - 7890" value={phone} onChange={(e) => setPhone(e.target.value)} required/><br></br>
        </div>
          <button id="submitButton" type="submit" style={{ width: '100%', alignItems: 'center' }} > Sign Up </button>
        <div className="container-link">
          <Link to="/">Continue to Login Page</Link>
        </div>
      </form>
    </div>
    </div>
  )
}

export default Started
