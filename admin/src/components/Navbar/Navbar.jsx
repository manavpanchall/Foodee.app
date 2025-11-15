import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'

const Navbar = ({ onLogout }) => {
  return (
    <div className='navbar'>
        <img className='logo' src={assets.logo} alt='' />
        <div className="navbar-right">
            <div className="navbar-profile">
                <img src={assets.profile_image} alt="" />
                <div className="profile-dropdown">
                    <p>Admin Panel</p>
                    <button onClick={onLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar