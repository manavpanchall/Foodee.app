import foodModel from "../models/foodModel.js";
import cloudinary from '../config/cloudinary.js';

// Add food item
const addFood = async (req, res) => {
    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'foodee',
            transformation: [
                { width: 500, height: 500, crop: 'limit' },
                { quality: 'auto', format: 'auto' }
            ]
        });

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: result.public_id, // Store public_id for easy deletion
            imageUrl: result.secure_url, // Store URL for display
            foodType: req.body.foodType || "veg"
        });
        
        await food.save();
        res.json({ success: true, message: "Food Added", data: food });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding food" });
    }
}

// All food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching foods" });
    }
}

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food && food.image) {
            // Delete image from Cloudinary
            await cloudinary.uploader.destroy(food.image);
        }
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing food" });
    }
}

// Update food item
const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category, foodType } = req.body;
        let updateData = {
            name,
            description,
            price: Number(price),
            category,
            foodType: foodType || "veg"
        };

        // If new image is uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            const oldFood = await foodModel.findById(id);
            if (oldFood && oldFood.image) {
                await cloudinary.uploader.destroy(oldFood.image);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'foodee',
                transformation: [
                    { width: 500, height: 500, crop: 'limit' },
                    { quality: 'auto', format: 'auto' }
                ]
            });

            updateData.image = result.public_id;
            updateData.imageUrl = result.secure_url;
        }

        await foodModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Food Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food" });
    }
}

export { addFood, listFood, removeFood, updateFood }