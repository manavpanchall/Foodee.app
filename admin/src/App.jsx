import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Login from './components/Login/Login'
import { Route, Routes, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import PromoCode from './pages/PromoCode/PromoCode'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const url = "http://localhost:4000"

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (status) => {
    setIsAuthenticated(status)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Admin Panel...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div>
      <ToastContainer/>
      <Navbar onLogout={handleLogout} />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path='/add' element={<Add url={url}/>}/>
          <Route path='/list' element={<List url={url}/>}/>
          <Route path='/orders' element={<Orders url={url}/>}/>
          <Route path='/promo-codes' element={<PromoCode url={url}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App