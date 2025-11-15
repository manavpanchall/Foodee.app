import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // Cloudinary public_id
    imageUrl: { type: String, required: true }, // Cloudinary URL
    category: { type: String, required: true },
    foodType: { type: String, default: "veg" }
});

const foodModel = mongoose.models.food || mongoose.model('food', foodSchema);

export default foodModel;