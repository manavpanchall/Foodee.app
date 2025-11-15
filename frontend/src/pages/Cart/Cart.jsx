import React, { useContext, useState, useEffect } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const [promoCodes, setPromoCodes] = useState([]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoInput, setPromoInput] = useState('');
  const [showPromoCodes, setShowPromoCodes] = useState(false);

  // Fetch available promo codes
  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get(`${url}/api/promo/list`);
      if (response.data.success) {
        setPromoCodes(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Apply promo code
  const applyPromoCode = async () => {
    if (!promoInput.trim()) {
      alert('Please enter a promo code');
      return;
    }

    try {
      const response = await axios.post(`${url}/api/promo/validate`, {
        code: promoInput.trim(),
        orderAmount: getTotalCartAmount()
      });

      if (response.data.success) {
        setAppliedPromo(response.data.data);
        alert('Promo code applied successfully!');
        setPromoInput('');
        setShowPromoCodes(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert('Invalid promo code or not applicable');
    }
  }

  // Remove applied promo
  const removePromoCode = () => {
    setAppliedPromo(null);
  }

  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;

    const subtotal = getTotalCartAmount();
    
    if (appliedPromo.discountType === 'fixed') {
      return Math.min(appliedPromo.discountAmount, subtotal);
    } else {
      const discount = (subtotal * appliedPromo.discountAmount) / 100;
      if (appliedPromo.maxDiscount) {
        return Math.min(discount, appliedPromo.maxDiscount);
      }
      return discount;
    }
  }

  const discountAmount = calculateDiscount();
  const deliveryFee = getTotalCartAmount() === 0 ? 0 : 80;
  const finalTotal = getTotalCartAmount() + deliveryFee - discountAmount;

  const handleRemoveItem = (itemId) => {
    setShowRemoveConfirm(itemId);
  }

  const confirmRemove = (itemId) => {
    removeFromCart(itemId);
    setShowRemoveConfirm(null);
  }

  const cancelRemove = () => {
    setShowRemoveConfirm(null);
  }

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.imageUrl} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn" 
                      onClick={() => removeFromCart(item._id)}
                    >
                      -
                    </button>
                    <span className="quantity-display">{cartItems[item._id]}</span>
                    <button 
                      className="quantity-btn" 
                      onClick={() => addToCart(item._id)}
                    >
                      +
                    </button>
                  </div>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p onClick={() => handleRemoveItem(item._id)} className='cross'>x</p>
                </div>
                <hr />
                
                {/* Remove Confirmation Modal */}
                {showRemoveConfirm === item._id && (
                  <div className="modal-overlay">
                    <div className="confirm-modal">
                      <h3>Remove Item</h3>
                      <p>Are you sure you want to remove "{item.name}" from your cart?</p>
                      <div className="modal-actions">
                        <button 
                          className="confirm-btn"
                          onClick={() => confirmRemove(item._id)}
                        >
                          Yes, Remove
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={cancelRemove}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
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
              <p>₹{deliveryFee}</p>
            </div>
            
            {/* Applied Promo Code */}
            {appliedPromo && (
              <>
                <hr />
                <div className="cart-total-details promo-applied">
                  <p>
                    Discount ({appliedPromo.code})
                    <span className="remove-promo" onClick={removePromoCode}>✕</span>
                  </p>
                  <p className="discount-amount">-₹{discountAmount}</p>
                </div>
              </>
            )}
            
            <hr />
            <div className="cart-total-details final-total">
              <p>Total</p>
              <p>₹{finalTotal}</p>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>Proceed to Checkout</button>
        </div>
        
        {/* Promo Code Section */}
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            
            {/* Available Promo Codes */}
            <div className="available-promo-codes">
              <button 
                className="show-promo-btn"
                onClick={() => setShowPromoCodes(!showPromoCodes)}
              >
                {showPromoCodes ? 'Hide Available Codes' : 'Show Available Codes'}
              </button>
              
              {showPromoCodes && (
                <div className="promo-codes-list">
                  <h4>Available Promo Codes:</h4>
                  {promoCodes.filter(promo => new Date(promo.validUntil) > new Date()).map((promo) => (
                    <div key={promo._id} className="promo-code-item">
                      <span className="promo-code-text">{promo.code}</span>
                      <span className="promo-discount">
                        {promo.discountType === 'fixed' 
                          ? `₹${promo.discountAmount} OFF` 
                          : `${promo.discountAmount}% OFF`
                        }
                        {promo.minOrderAmount > 0 && ` on orders above ₹${promo.minOrderAmount}`}
                      </span>
                    </div>
                  ))}
                  {promoCodes.filter(promo => new Date(promo.validUntil) > new Date()).length === 0 && (
                    <p className="no-promo-codes">No active promo codes available</p>
                  )}
                </div>
              )}
            </div>

            <div className="cart-promocode-input">
              <input 
                type='text' 
                placeholder='Enter promo code' 
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
              />
              <button onClick={applyPromoCode}>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart