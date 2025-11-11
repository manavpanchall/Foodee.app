import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image, foodType }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    const getFoodTypeIcon = (type) => {
        switch(type) {
            case 'veg': return '🟢';
            case 'non-veg': return '🔴';
            case 'unsure': return '🟡';
            default: return '⚪';
        }
    }

    const getFoodTypeColor = (type) => {
        switch(type) {
            case 'veg': return '#28a745';
            case 'non-veg': return '#dc3545';
            case 'unsure': return '#ffc107';
            default: return '#6c757d';
        }
    }

    return (
        <div className="food-item">
            <div className='food-item-img-container'>
                <img className='food-item-image' src={url+"/images/"+image} alt='' />
                <div className="food-type-badge" style={{backgroundColor: getFoodTypeColor(foodType)}}>
                    {getFoodTypeIcon(foodType)}
                </div>
                {!cartItems[id]
                    ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt='' />
                    : <div className='food-item-counter'>
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt='' />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt='' />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />
                </div>
                <p className='food-item-desc'>{description}</p>
                <p className='food-item-price'>₹{price}</p>
            </div>
        </div>
    )
}

export default FoodItem