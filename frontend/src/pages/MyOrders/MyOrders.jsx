import React, { useContext, useState, useEffect } from 'react'
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';

const MyOrders = () => {

  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
    // Reverse to show latest orders first
    const reversedData = response.data.data.reverse();
    setData(reversedData);
  }

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token])

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return '#28a745';
      case 'Out for delivery': return '#ffc107';
      case 'Food Processing': return '#17a2b8';
      default: return '#6c757d';
    }
  }

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
    <div className='my-orders'>
      <h2>My Orders</h2>
      {data.length === 0 ? (
        <div className="no-orders">
          <img src={assets.parcel_icon} alt="No orders" />
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="container">
          {data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <div className="order-header">
                <div className="order-basic-info">
                  <div className="order-number">Order #{data.length - index}</div>
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
                {/* Order Items with Scroll */}
                <div className="order-items-scroll">
                  <div className="scroll-title">Ordered Items ({order.items.length})</div>
                  <div className="items-scroll-container">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="scroll-item">
                        <img src={`${url}/images/`+item.image} alt={item.name} />
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-meta">
                            <span>Qty: {item.quantity}</span>
                            <span>₹{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="order-details-compact">
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="status-badge" style={{backgroundColor: getStatusColor(order.status)}}>
                      {order.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Payment:</span>
                    <span className={`payment-badge ${getPaymentStatusClass(order.payment, order.paymentMethod, order.status)}`}>
                      {getPaymentStatus(order.payment, order.paymentMethod, order.status)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Items:</span>
                    <span className="items-count">{order.items.length} items</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info - Collapsible */}
              <div className="delivery-info">
                <div className="delivery-summary">
                  <span className="delivery-icon">📍</span>
                  <span className="delivery-text">
                    {order.address.street}, {order.address.city}
                  </span>
                </div>
                <div className="customer-name">{order.address.firstName} {order.address.lastName}</div>
                <div className="customer-phone">{order.address.phone}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders