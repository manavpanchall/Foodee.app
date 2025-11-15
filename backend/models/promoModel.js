import mongoose from "mongoose";

const promoSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountAmount: { type: Number, required: true },
    discountType: { type: String, enum: ['fixed', 'percentage'], required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    validUntil: { type: Date, required: true }
}, { timestamps: true });

const PromoCode = mongoose.models.promo || mongoose.model('promo', promoSchema);

export default PromoCode;