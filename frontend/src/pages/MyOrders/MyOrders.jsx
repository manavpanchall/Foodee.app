import React, { useContext, useState, useEffect } from 'react'
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
    const reversedData = response.data.data.reverse();
    setData(reversedData);
  }

  // Format date to DD-MMM-YYYY, hh:mm AM/PM (12-hour format) in IST
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(date.getTime() + istOffset);
    
    // Get IST components
    const day = istDate.getUTCDate().toString().padStart(2, '0');
    const month = istDate.toLocaleString('en-US', { month: 'short' });
    const year = istDate.getUTCFullYear();
    
    // Get time in 12-hour format
    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`;
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
      case 'Cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }

  const getPaymentStatus = (payment, paymentMethod, status) => {
    if (status === 'Cancelled') {
      if (paymentMethod === 'cod') {
        return 'COD Cancelled';
      } else {
        return 'Refunded';
      }
    }
    
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
    if (status === 'Cancelled') {
      return 'cancelled';
    }
    if (paymentMethod === 'cod') {
      return status === 'Delivered' ? 'paid' : 'pending';
    } else {
      return payment ? 'paid' : 'pending';
    }
  }

  const canCancelOrder = (status) => {
    return status === 'Food Processing';
  }

  const cancelOrder = async (orderId, paymentMethod) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await axios.post(url + "/api/order/cancel", {
        orderId,
        paymentMethod
      }, { headers: { token } });

      if (response.data.success) {
        alert("Order cancelled successfully");
        fetchOrders();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error cancelling order");
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
                    {formatDate(order.date)}
                  </div>
                </div>
                <div className="order-amount">₹{order.amount}</div>
              </div>

              <div className="order-content">
                <div className="order-items-scroll">
                  <div className="scroll-title">Ordered Items ({order.items.length})</div>
                  <div className="items-scroll-container">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="scroll-item">
                        {/* Use imageUrl from Cloudinary */}
                        <img src={item.imageUrl} alt={item.name} />
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

              {canCancelOrder(order.status) && (
                <div className="cancel-order-section">
                  <button 
                    className="cancel-order-btn"
                    onClick={() => cancelOrder(order._id, order.paymentMethod)}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders