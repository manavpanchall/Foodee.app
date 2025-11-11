import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item
const addFood = async (req, res) => {
    try {
        let image_filename = `${req.file.filename}`;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
            foodType: req.body.foodType || "veg"
        });
        
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// All food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food && food.image) {
            fs.unlink(`uploads/${food.image}`, () => { });
        }
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
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
            // Remove old image
            const oldFood = await foodModel.findById(id);
            if (oldFood && oldFood.image) {
                fs.unlink(`uploads/${oldFood.image}`, () => { });
            }
            updateData.image = req.file.filename;
        }

        await foodModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Food Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food" });
    }
}

export { addFood, listFood, removeFood, updateFood }