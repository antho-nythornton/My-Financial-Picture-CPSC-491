import './Started.css';
import {Link} from 'react-router-dom';

function Started() {
  return (
    <div className="login-page">
    <div className="container">
      <h1>Get Started</h1>
      <p>Sign Up for a free account</p><br /><br />
      <div className="SignUp-container">
        <div className="SignUp">
          <label htmlFor="emailprompt" >Email</label>
          <input className="email-field" type="email" id="emailprompt" placeholder="example@gmail.com" required />
          <div className="password-container">
            <div className="password-field">
              <label htmlFor="password">Password</label>
              <input className="password-field" type="password" id="password" placeholder="Enter your password" required/>
            </div>
            <div className="password-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" placeholder="Enter your password" required/>
            </div>
          </div>
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" placeholder="(123) - 456 - 7890" required/><br></br>
        </div>
        <div>
          <button id= "submitButton" type="submit" style={{ width: '100%', alignItems: 'center' }}>Sign up</button>
        </div>
        <div className="container-link">
          <Link to="/">Continue to Login Page</Link>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Started
