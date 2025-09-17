function Login() {
  return (
    <div className="container">
      <h1>My Financial Picture</h1>
      <h2>Login</h2>
      <div className="Login-container">
        <div className="login">
          <label htmlFor="email" style={{ color: 'black' }}>Email</label><br />
          <input type="email" id="email" placeholder="Enter your email" /><br />
          <label htmlFor="password" style={{ color: 'black' }}>Password</label><br />
          <input type="password" id="password" placeholder="Enter your password" /><br />
        </div>
        <button id="submitButton" type="button">
          Submit
        </button>
      </div>
    </div>
  )
}

export default Login
