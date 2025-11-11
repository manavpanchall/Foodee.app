import React, { useState, useEffect } from 'react'
import './List.css';
import axios from "axios"
import { toast } from 'react-toastify';

const List = ({url}) => {

    const [list, setList] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        foodType: "veg"
    });
    const [editImage, setEditImage] = useState(null);
    const [newCategory, setNewCategory] = useState("");

    const fetchList = async () => {
        const response = await axios.get(`${url}/api/food/list`)
        
        if (response.data.success) {
            setList(response.data.data);
        } else {
            toast.error("Error")
        }
    }

    const removeFood = async(foodId) => {
        const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
        await fetchList();
        if (response.data.success) {
            toast.success(response.data.message)
        } else {
            toast.error("Error")
        }
    }

    const startEdit = (item) => {
        setEditingItem(item._id);
        setEditForm({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            foodType: item.foodType || "veg"
        });
        setNewCategory("");
        setEditImage(null);
    }

    const cancelEdit = () => {
        setEditingItem(null);
        setEditForm({
            name: "",
            description: "",
            price: "",
            category: "Salad",
            foodType: "veg"
        });
        setNewCategory("");
        setEditImage(null);
    }

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const updateFood = async (foodId) => {
        try {
            const finalCategory = editForm.category === "new" ? newCategory : editForm.category;
            
            const formData = new FormData();
            formData.append("id", foodId);
            formData.append("name", editForm.name);
            formData.append("description", editForm.description);
            formData.append("price", editForm.price);
            formData.append("category", finalCategory);
            formData.append("foodType", editForm.foodType);
            if (editImage) {
                formData.append("image", editImage);
            }

            const response = await axios.post(`${url}/api/food/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success("Food item updated successfully");
                setEditingItem(null);
                await fetchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error updating food item");
        }
    }

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

    useEffect(() => {
        fetchList();
    }, [])

    return (
        <div className='list add flex-col'>
            <p>All Foods List</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Type</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Actions</b>
                </div>
                {list.map((item,index)=>{
                    return (
                        <div key={index} className='list-table-format'>
                            <img src={`${url}/images/`+item.image} alt='' />
                            
                            {editingItem === item._id ? (
                                <>
                                    <div className="edit-form">
                                        <input
                                            type="text"
                                            name="name"
                                            value={editForm.name}
                                            onChange={handleEditChange}
                                            placeholder="Product Name"
                                        />
                                        <textarea
                                            name="description"
                                            value={editForm.description}
                                            onChange={handleEditChange}
                                            placeholder="Description"
                                            rows="2"
                                        />
                                        <div className="food-type-edit">
                                            <label className={`food-type-option ${editForm.foodType === 'veg' ? 'active' : ''}`}>
                                                <input
                                                    type="radio"
                                                    name="foodType"
                                                    value="veg"
                                                    checked={editForm.foodType === 'veg'}
                                                    onChange={handleEditChange}
                                                />
                                                <span className="food-type-icon" style={{color: getFoodTypeColor('veg')}}>
                                                    {getFoodTypeIcon('veg')}
                                                </span>
                                            </label>
                                            <label className={`food-type-option ${editForm.foodType === 'non-veg' ? 'active' : ''}`}>
                                                <input
                                                    type="radio"
                                                    name="foodType"
                                                    value="non-veg"
                                                    checked={editForm.foodType === 'non-veg'}
                                                    onChange={handleEditChange}
                                                />
                                                <span className="food-type-icon" style={{color: getFoodTypeColor('non-veg')}}>
                                                    {getFoodTypeIcon('non-veg')}
                                                </span>
                                            </label>
                                            <label className={`food-type-option ${editForm.foodType === 'unsure' ? 'active' : ''}`}>
                                                <input
                                                    type="radio"
                                                    name="foodType"
                                                    value="unsure"
                                                    checked={editForm.foodType === 'unsure'}
                                                    onChange={handleEditChange}
                                                />
                                                <span className="food-type-icon" style={{color: getFoodTypeColor('unsure')}}>
                                                    {getFoodTypeIcon('unsure')}
                                                </span>
                                            </label>
                                        </div>
                                        <select
                                            name="category"
                                            value={editForm.category}
                                            onChange={handleEditChange}
                                        >
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
                                        {editForm.category === "new" && (
                                            <input
                                                type="text"
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                placeholder="New category name"
                                                className="new-category-input"
                                            />
                                        )}
                                        <input
                                            type="number"
                                            name="price"
                                            value={editForm.price}
                                            onChange={handleEditChange}
                                            placeholder="Price"
                                        />
                                        <div className="image-upload">
                                            <label>Change Image:</label>
                                            <input
                                                type="file"
                                                onChange={(e) => setEditImage(e.target.files[0])}
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                    <div className="edit-actions">
                                        <button 
                                            className="save-btn"
                                            onClick={() => updateFood(item._id)}
                                        >
                                            Save
                                        </button>
                                        <button 
                                            className="cancel-btn"
                                            onClick={cancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>{item.name}</p>
                                    <div className="food-type-display" style={{color: getFoodTypeColor(item.foodType)}}>
                                        {getFoodTypeIcon(item.foodType)}
                                    </div>
                                    <p>{item.category}</p>
                                    <p>₹{item.price}</p>
                                    <div className="action-buttons">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => startEdit(item)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => removeFood(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default List