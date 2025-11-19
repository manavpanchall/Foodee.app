import React, { Profiler, useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("menu");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/")
  }

  const handleCartClick = () => {
    window.scrollTo(0, 0); // Scroll to top
    navigate('/cart');
  }

  const handleHomeClick = () => {
    window.scrollTo(0, 0); // Scroll to top
    setMenu("home");
    navigate('/');
  }

  return (
    <div className='navbar'>
      <Link to='/' onClick={handleHomeClick}><img src={assets.logo} alt="" className='logo' /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => { setMenu("home"); window.scrollTo(0, 0); }} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-icon">
          <button onClick={handleCartClick} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <img src={assets.basket_icon} alt="Cart" />
          </button>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button> :
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt='' />
            <ul className='nav-profile-dropdown'>
              <li onClick={() => { navigate('/myorders'); window.scrollTo(0, 0); }}><img src={assets.bag_icon} alt='' /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt='' /><p>Logout</p></li>
            </ul>
          </div>}
      </div>
    </div>
  )
}

export default Navbar