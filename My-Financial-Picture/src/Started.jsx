import { useState } from "react";
import './Started.css';
import {Link, useNavigate} from 'react-router-dom';
import { API_BASE } from './lib/api';


function Started() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: phone,
          email: email,
          password: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("Account created successfully!");
        navigate("/");
      } else {
        alert(`Error: ${data.detail || 'Registration failed'}`)
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="login-page">
    <div className="container">
      <h1>Get Started</h1>
      <p>Sign Up for a free account</p><br /><br />
      <form className="SignUp-container" onSubmit={handleSubmit}>
        <div className="SignUp">
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
