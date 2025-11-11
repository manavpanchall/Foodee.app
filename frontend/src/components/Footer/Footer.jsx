import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img className='footer-logo' src={assets.logo} alt='' />
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora facere voluptatibus, minus quidem voluptates eaque modi veritatis. Omnis, nobis ipsa voluptates nisi error doloremque voluptas quam velit reiciendis saepe id?</p>
                    <div className="footer-social-icons">
                        <a href="https://www.facebook.com/manavpanchall/" target="_blank" rel="noopener noreferrer">
                            <img src={assets.facebook_icon} alt="Facebook" />
                        </a>
                        <a href="https://x.com/manavpanchall" target="_blank" rel="noopener noreferrer">
                            <img src={assets.twitter_icon} alt="Twitter" />
                        </a>
                        <a href="https://www.linkedin.com/in/manavpanchall/" target="_blank" rel="noopener noreferrer">
                            <img src={assets.linkedin_icon} alt="LinkedIn" />
                        </a>
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li><a href="#about">About us</a></li>
                        <li><a href="#delivery">Delivery</a></li>
                        <li><a href="#privacy">Privacy policy</a></li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li><a href="tel:+911234987654">+91 1234987654</a></li>
                        <li><a href="mailto:contact@Foodee.com">contact@Foodee.com</a></li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className='footer-copyright'>Copyright © 2025 Foodee. All rights reserved.</p>
        </div>
    )
}

export default Footer