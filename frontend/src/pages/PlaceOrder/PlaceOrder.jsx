import React, { useContext, useState, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const [paymentMethod, setPaymentMethod] = useState('online');
  const [showCodConfirm, setShowCodConfirm] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    } 
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token, getTotalCartAmount, navigate])

  const placeOrder = async (event) => {
    event.preventDefault();

    if (paymentMethod === 'cod') {
      setShowCodConfirm(true);
      return;
    }

    await processOrder();
  }

  const processOrder = async () => {
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo)
      }
    })

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 80,
      paymentMethod: paymentMethod
    }

    try {
      if (paymentMethod === 'online') {
        // Online payment with Razorpay
        let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

        if (response.data.success) {
          const { key, razorpayOrderId, orderId } = response.data;

          const options = {
            key: key,
            amount: response.data.amount * 100,
            currency: "INR",
            name: "Foodee",
            description: "Food Payment",
            order_id: razorpayOrderId,
            handler: async function (paymentResponse) {
              console.log("Payment successful, updating database...");
              try {
                await axios.post(url + "/api/order/verify", { success: "true", orderId });
                alert("Payment Successful! Order placed.");
                window.location.href = "/myorders";
              } catch (err) {
                console.error("Error:", err);
                alert("Payment successful but verification failed.");
              }
            },
            prefill: {
              name: data.firstName + " " + data.lastName,
              email: data.email,
              contact: data.phone,
            },
            theme: {
              color: "#F54748"
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          alert("Error placing order");
        }
      } else {
        // COD payment - place order directly
        const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
        
        if (response.data.success) {
          alert("Order placed successfully with Cash on Delivery!");
          window.location.href = "/myorders";
        } else {
          alert("Error placing order");
        }
      }
    } catch (error) {
      console.error("Place order error:", error);
      alert("Something went wrong while placing the order");
    }
  }

  return (
    <>
      <form onSubmit={placeOrder} className='place-order'>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type='text' placeholder='First name' />
            <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type='text' placeholder='Last name' />
          </div>
          <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
          <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
          <div className="multi-fields">
            <input required name='city' onChange={onChangeHandler} value={data.city} type='text' placeholder='City' />
            <input required name='state' onChange={onChangeHandler} value={data.state} type='text' placeholder='State' />
          </div>
          <div className="multi-fields">
            <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type='text' placeholder='Zip code' />
            <input required name='country' onChange={onChangeHandler} value={data.country} type='text' placeholder='Country' />
          </div>
          <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />

          <div className="payment-method">
            <p className="title">Payment Method</p>
            <div className="payment-options">
              <label className="payment-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="online" 
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                />
                <span className="checkmark"></span>
                <div className="payment-info">
                  <span className="payment-name">Pay Online</span>
                  <span className="payment-desc">Secure payment with Razorpay</span>
                </div>
              </label>
              
              <label className="payment-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span className="checkmark"></span>
                <div className="payment-info">
                  <span className="payment-name">Cash on Delivery</span>
                  <span className="payment-desc">Pay when you receive your order</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>₹{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>₹{getTotalCartAmount() === 0 ? 0 : 80}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Total</p>
                <p>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 80}</p>
              </div>
            </div>
            <button type='submit'>
              {paymentMethod === 'online' ? 'Proceed to Payment' : 'Place Order (COD)'}
            </button>
          </div>
        </div>
      </form>

      {/* COD Confirmation Modal */}
      {showCodConfirm && (
        <div className="modal-overlay">
          <div className="cod-confirm-modal">
            <h3>Confirm Cash on Delivery</h3>
            <p>Are you sure you want to place this order with Cash on Delivery?</p>
            <p className="order-amount">Total Amount: ₹{getTotalCartAmount() + 80}</p>
            <div className="modal-actions">
              <button 
                className="confirm-btn"
                onClick={processOrder}
              >
                Yes, Place Order
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setShowCodConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PlaceOrder