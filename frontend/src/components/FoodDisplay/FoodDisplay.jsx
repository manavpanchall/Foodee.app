import React, { useState } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext.jsx'
import FoodItem from '../FoodItem/FoodItem.jsx'

const FoodDisplay = ({ category }) => {
    const { food_list } = React.useContext(StoreContext)
    
    // Get unique categories from food list
    const categories = ["All", ...new Set(food_list.map(item => item.category))];
    
    // Food type options
    const foodTypes = [
        { value: "all", label: "All Types", icon: "⚪" },
        { value: "veg", label: "Veg", icon: "🟢" },
        { value: "non-veg", label: "Non-Veg", icon: "🔴" },
        { value: "jain", label: "Jain", icon: "🟡" }
    ];

    const [selectedCategory, setSelectedCategory] = useState(category || "All");
    const [selectedFoodType, setSelectedFoodType] = useState("all");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);

    const filteredFoods = food_list.filter(item => {
        const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
        const typeMatch = selectedFoodType === "all" || item.foodType === selectedFoodType;
        return categoryMatch && typeMatch;
    });

    console.log("Food List:", food_list); // Debug: Check what data we're getting
    console.log("Filtered Foods:", filteredFoods); // Debug: Check filtered items

    return (
        <div className='food-display' id='food-display'>
            <div className="food-display-header">
                <h2>Top dishes near you</h2>
                <div className="filter-container">
                    {/* Category Filter Dropdown */}
                    <div className="filter-dropdown">
                        <button 
                            className="filter-dropdown-btn"
                            onClick={() => {
                                setShowCategoryDropdown(!showCategoryDropdown);
                                setShowTypeDropdown(false);
                            }}
                        >
                            <span className="filter-label">Category: {selectedCategory}</span>
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        {showCategoryDropdown && (
                            <div className="dropdown-menu">
                                {categories.map((cat, index) => (
                                    <div
                                        key={index}
                                        className={`dropdown-item ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setShowCategoryDropdown(false);
                                        }}
                                    >
                                        {cat}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Food Type Filter Dropdown */}
                    <div className="filter-dropdown">
                        <button 
                            className="filter-dropdown-btn"
                            onClick={() => {
                                setShowTypeDropdown(!showTypeDropdown);
                                setShowCategoryDropdown(false);
                            }}
                        >
                            <span className="filter-label">
                                Type: {foodTypes.find(type => type.value === selectedFoodType)?.label}
                            </span>
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        {showTypeDropdown && (
                            <div className="dropdown-menu">
                                {foodTypes.map((type, index) => (
                                    <div
                                        key={index}
                                        className={`dropdown-item ${selectedFoodType === type.value ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedFoodType(type.value);
                                            setShowTypeDropdown(false);
                                        }}
                                    >
                                        <span className="type-icon">{type.icon}</span>
                                        <span>{type.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear Filters Button */}
                    {(selectedCategory !== "All" || selectedFoodType !== "all") && (
                        <button 
                            className="clear-filters-btn"
                            onClick={() => {
                                setSelectedCategory("All");
                                setSelectedFoodType("all");
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory !== "All" || selectedFoodType !== "all") && (
                <div className="active-filters">
                    <span className="active-filters-label">Active Filters:</span>
                    {selectedCategory !== "All" && (
                        <span className="active-filter-tag">
                            Category: {selectedCategory}
                            <span 
                                className="remove-filter" 
                                onClick={() => setSelectedCategory("All")}
                            >
                                ×
                            </span>
                        </span>
                    )}
                    {selectedFoodType !== "all" && (
                        <span className="active-filter-tag">
                            Type: {foodTypes.find(type => type.value === selectedFoodType)?.label}
                            <span 
                                className="remove-filter" 
                                onClick={() => setSelectedFoodType("all")}
                            >
                                ×
                            </span>
                        </span>
                    )}
                </div>
            )}

            <div className="food-display-list">
                {filteredFoods.map((item, index) => {
                    console.log("Rendering item:", item); // Debug each item
                    return (
                        <FoodItem 
                            key={index} 
                            id={item._id} 
                            name={item.name} 
                            description={item.description} 
                            price={item.price} 
                            image={item.image}
                            imageUrl={item.imageUrl} // Make sure this is passed
                            foodType={item.foodType || "veg"}
                        />
                    )
                })}
            </div>
            {filteredFoods.length === 0 && (
                <div className="no-items-found">
                    <p>No dishes found with the selected filters.</p>
                    <button 
                        className="reset-filters-btn"
                        onClick={() => {
                            setSelectedCategory("All");
                            setSelectedFoodType("all");
                        }}
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    )
}

export default FoodDisplay