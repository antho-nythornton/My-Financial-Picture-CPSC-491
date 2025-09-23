import './Reset_password.css';
import {Link} from 'react-router-dom';

function Reset_password() {
  return (
    <div className="reset-password">
    <div className="container">
      <h1>Reset Password</h1>
      <div className="Reset-password-container">
        <div className="Reset-password">
          <label htmlFor="email" id ="email" >Email</label>
          <input type="email" id="email" placeholder="example@gmail.com"/>
        </div>
        <div>
          <button id= "submitButton" type="button" style={{ width: '100%', alignItems: 'center' }}>Reset Password</button>
        </div>
        <div className="container-link">
          <Link to="/">Continue to Login Page</Link>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Reset_password
