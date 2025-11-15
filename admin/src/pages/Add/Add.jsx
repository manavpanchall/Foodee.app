import React, { useState } from 'react'
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from 'react-toastify';

const Add = ({url}) => {

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        foodType: "veg" // veg, non-veg, jain
    })
    const [newCategory, setNewCategory] = useState("");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        // Use new category if provided
        const finalCategory = data.category === "new" ? newCategory : data.category;
        
        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", finalCategory)
        formData.append("foodType", data.foodType)
        formData.append("image", image)
        
        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            setData({
                name: "",
                description: "",
                price: "",
                category: "Salad",
                foodType: "veg"
            })
            setNewCategory("");
            setImage(false)
            toast.success(response.data.message)
        } else {
            toast.error(response.data.message)
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

    const getFoodTypeIcon = (type) => {
        switch(type) {
            case 'veg': return '🟢';
            case 'non-veg': return '🔴';
            case 'jain': return '🟡';
            default: return '⚪';
        }
    }

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor='image'>
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt='' />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden required />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input onChange={onChangeHandler} value={data.name} type='text' name='name' placeholder='Type here' />
                </div>
                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name='description' rows="6" placeholder='Write content here' required></textarea>
                </div>
                
                <div className="add-category-type">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select onChange={onChangeHandler} name='category' value={data.category}>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                            <option value="Biryani">Biryani</option>
                            <option value="Curry">Curry</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Beverages">Beverages</option>
                            <option value="new">+ Add New Category</option>
                        </select>
                        {data.category === "new" && (
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Enter new category name"
                                className="new-category-input"
                                required
                            />
                        )}
                    </div>
                    
                    <div className="add-food-type flex-col">
                        <p>Food Type</p>
                        <div className="food-type-options">
                            <label className={`food-type-option ${data.foodType === 'veg' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="foodType"
                                    value="veg"
                                    checked={data.foodType === 'veg'}
                                    onChange={onChangeHandler}
                                />
                                <span className="food-type-icon" style={{color: getFoodTypeColor('veg')}}>
                                    {getFoodTypeIcon('veg')}
                                </span>
                                <span>Veg</span>
                            </label>
                            
                            <label className={`food-type-option ${data.foodType === 'non-veg' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="foodType"
                                    value="non-veg"
                                    checked={data.foodType === 'non-veg'}
                                    onChange={onChangeHandler}
                                />
                                <span className="food-type-icon" style={{color: getFoodTypeColor('non-veg')}}>
                                    {getFoodTypeIcon('non-veg')}
                                </span>
                                <span>Non-Veg</span>
                            </label>
                            
                            <label className={`food-type-option ${data.foodType === 'jain' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="foodType"
                                    value="jain"
                                    checked={data.foodType === 'jain'}
                                    onChange={onChangeHandler}
                                />
                                <span className="food-type-icon" style={{color: getFoodTypeColor('jain')}}>
                                    {getFoodTypeIcon('jain')}
                                </span>
                                <span>Jain</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div className="add-price flex-col">
                    <p>Product price</p>
                    <input onChange={onChangeHandler} value={data.price} type='Number' name='price' placeholder='₹20' />
                </div>
                
                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>
    )
}

export default Add