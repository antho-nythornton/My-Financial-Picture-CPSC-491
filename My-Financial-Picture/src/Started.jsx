import './Started.css';

function Started() {
  return (
    <div className="container">
      <h1>Get Started</h1>
      <p1>Sign Up for a free account</p1><br /><br />
      <div className="SignUp-container">
        <div className="SignUp">
          <label htmlFor="email" id ="email" >Email</label>
          <input type="email" id="email" placeholder="example@gmail.com" />
            <div className="password-container">
            <div className="password-field">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" />
            </div>
            <div className="password-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" placeholder="Enter your password" />
            </div>
          </div>
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" placeholder="(123) - 456 - 7890" /><br></br>
        </div>
        <button id= "button" type="button" style={{ width: '100%', alignItems: 'center' }}>Sign up</button>
      </div>
    </div>
  )
}

export default Started
