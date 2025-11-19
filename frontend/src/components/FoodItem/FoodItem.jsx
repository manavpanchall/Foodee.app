import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image, imageUrl, foodType }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

    const handleAddToCart = (itemId) => {
        addToCart(itemId);
        // Smooth scroll to top if user is at bottom of page
        if (window.scrollY > 500) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const handleRemoveFromCart = (itemId) => {
        removeFromCart(itemId);
        // Smooth scroll to top if user is at bottom of page
        if (window.scrollY > 500) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const getFoodTypeIcon = (type) => {
        switch(type) {
            case 'veg': return '🟢';
            case 'non-veg': return '🔴';
            case 'jain': return '🟡';
            default: return '⚪';
        }
    }

    const getFoodTypeColor = (type) => {
        switch(type) {
            case 'veg': return '#28a745';
            case 'non-veg': return '#dc3545';
            case 'jain': return '#ffc107';
            default: return '#6c757d';
        }
    }

    return (
        <div className="food-item">
            <div className='food-item-img-container'>
                <img className='food-item-image' src={imageUrl} alt={name} />
                <div className="food-type-badge" style={{backgroundColor: getFoodTypeColor(foodType)}}>
                    {getFoodTypeIcon(foodType)}
                </div>
                {!cartItems[id]
                    ? <img className='add' onClick={() => handleAddToCart(id)} src={assets.add_icon_white} alt='Add to cart' />
                    : <div className='food-item-counter'>
                        <img onClick={() => handleRemoveFromCart(id)} src={assets.remove_icon_red} alt='Remove' />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => handleAddToCart(id)} src={assets.add_icon_green} alt='Add more' />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating" />
                </div>
                <p className='food-item-desc'>{description}</p>
                <p className='food-item-price'>₹{price}</p>
            </div>
        </div>
    )
}

export default FoodItem