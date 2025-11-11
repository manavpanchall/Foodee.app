import React from 'react'
import './Orders.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import axios from "axios";
import { assets } from '../../assets/assets';


const Orders = ({url}) => {

  const [orders,setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url+"/api/order/list");
    if (response.data.success) {
      // Reverse the orders array to show latest first
      const reversedOrders = response.data.data.reverse();
      setOrders(reversedOrders);
      console.log(reversedOrders);
    }
    else {
      toast.error("Error")
    }
  }

  const statusHandler = async (event,orderId) => {
    const response = await axios.post(url+"/api/order/status",{
      orderId,
      status:event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  useEffect(()=> {
    fetchAllOrders();
  },[])

  const getPaymentStatus = (payment, paymentMethod, status) => {
    if (paymentMethod === 'cod') {
      if (status === 'Delivered') {
        return 'Paid (COD)';
      } else {
        return 'Pending (COD)';
      }
    } else if (payment) {
      return 'Paid Online';
    } else {
      return 'Payment Pending';
    }
  }

  const getPaymentStatusClass = (payment, paymentMethod, status) => {
    if (paymentMethod === 'cod') {
      return status === 'Delivered' ? 'paid' : 'pending';
    } else {
      return payment ? 'paid' : 'pending';
    }
  }

  return (
    <div className='order add'>
      <h3>Order Management</h3>
      <div className="order-stats">
        <div className="stat-card">
          <span className="stat-number">{orders.length}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {orders.filter(order => order.status === "Food Processing").length}
          </span>
          <span className="stat-label">Processing</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {orders.filter(order => order.status === "Out for delivery").length}
          </span>
          <span className="stat-label">Out for Delivery</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {orders.filter(order => order.status === "Delivered").length}
          </span>
          <span className="stat-label">Delivered</span>
        </div>
      </div>
      
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <div className="order-header">
              <div className="order-info">
                <div className="order-number">Order #{orders.length - index}</div>
                <div className="order-date">
                  {new Date(order.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="order-amount">₹{order.amount}</div>
            </div>
            
            <div className="order-content">
              {/* Customer & Items Section */}
              <div className="order-main">
                <div className="customer-section">
                  <div className="section-title">Customer</div>
                  <div className="customer-details">
                    <div className="customer-name">{order.address.firstName} {order.address.lastName}</div>
                    <div className="customer-contact">
                      <span className="contact-item">
                        <i className="phone-icon">📱</i>
                        {order.address.phone}
                      </span>
                      {order.address.email && (
                        <span className="contact-item">
                          <i className="email-icon">✉️</i>
                          {order.address.email}
                        </span>
                      )}
                    </div>
                    <div className="customer-address">
                      <i className="address-icon">📍</i>
                      {order.address.street}, {order.address.city}
                    </div>
                  </div>
                </div>

                <div className="items-section">
                  <div className="section-title">Items ({order.items.length})</div>
                  <div className="items-scroll-container">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="order-item-product">
                        <img src={`${url}/images/`+item.image} alt={item.name} />
                        <div className="product-info">
                          <div className="product-name">{item.name}</div>
                          <div className="product-meta">
                            <span className="quantity">Qty: {item.quantity}</span>
                            <span className="price">₹{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status & Actions Section */}
              <div className="order-actions">
                <div className="status-section">
                  <div className="section-title">Status</div>
                  <select 
                    onChange={(event)=>statusHandler(event,order._id)} 
                    value={order.status}
                    className="status-select"
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                
                <div className="payment-section">
                  <div className="section-title">Payment</div>
                  <div className={`payment-status ${getPaymentStatusClass(order.payment, order.paymentMethod, order.status)}`}>
                    {getPaymentStatus(order.payment, order.paymentMethod, order.status)}
                  </div>
                  <div className="payment-method">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders