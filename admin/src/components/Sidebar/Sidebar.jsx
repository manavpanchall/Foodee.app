import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation();
  
  // Check if current path is root, then consider orders as active
  const isOrdersActive = location.pathname === '/' || location.pathname === '/orders';
  
  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to='/add' className="sidebar-option">
                <img src={assets.add_icon} alt='' />
                <p>Add Items</p>
            </NavLink>
            <NavLink to='/list' className="sidebar-option">
                <img src={assets.order_icon} alt='' />
                <p>List Items</p>
            </NavLink>
            <NavLink 
              to='/orders' 
              className={`sidebar-option ${isOrdersActive ? 'active' : ''}`}
            >
                <img src={assets.order_icon} alt='' />
                <p>Orders</p>
            </NavLink>
            <NavLink to='/promo-codes' className="sidebar-option">
                <img src={assets.parcel_icon} alt='' />
                <p>Promo Codes</p>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar