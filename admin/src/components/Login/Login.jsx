import React, { useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets'

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Get admin credentials from environment variables
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
            setError('Admin credentials not configured')
            setLoading(false)
            return
        }

        // Simulate authentication check
        setTimeout(() => {
            if (credentials.email === adminEmail && credentials.password === adminPassword) {
                localStorage.setItem('adminAuthenticated', 'true')
                onLogin(true)
            } else {
                setError('Invalid email or password')
            }
            setLoading(false)
        }, 1000)
    }

    return (
        <div className="admin-login">
            <div className="login-container">
                <div className="login-header">
                    <img src={assets.logo} alt="Foodee Admin" className="login-logo" />
                    <h2>Admin Login</h2>
                    <p>Enter your credentials to access the admin panel</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Protected Admin Access</p>
                </div>
            </div>
        </div>
    )
}

export default Login