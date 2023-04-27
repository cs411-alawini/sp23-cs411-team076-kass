import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|edu)$/

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://35.209.21.140:8000/login',
        {
          username: email,
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
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
    <div className='main-div'>
      <div className='container-div'>
        <h1>Login</h1>
        <br></br>
        <div className='input-div'>
          <div className='input-label'>
            <label>Email:</label>
          </div>
          <div>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>
        <br></br>
        <div className='input-div'>
          <div className='input-label'>
            <label>Password:</label>
          </div>
          <div>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p>{error}</p>}
        <br></br>
        <br></br>
        <button onClick={handleLogin} disabled={!isFormValid()}>
          Login
        </button>
      </div>
    </div>
  )
}

export default Login
