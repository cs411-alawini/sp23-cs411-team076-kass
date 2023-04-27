import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|edu)$/

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://35.209.21.140:8000/login', {
        username: email,
        password: password
      })
      if (response.status === 200) {
        navigate('/navbar')
      }
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  const isFormValid = () => {
    return emailRegex.test(email) && password.length >= 6
  }

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label>Email:</label>
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {error && <p>{error}</p>}
      <button onClick={handleLogin} disabled={!isFormValid()}>
        Login
      </button>
    </div>
  )
}

export default Login
