import PromoCode from "../models/promoModel.js";

// Create new promo code
export const createPromoCode = async (req, res) => {
    try {
        const { code, discountAmount, discountType, minOrderAmount, maxDiscount, validUntil } = req.body;
        
        // Check if code already exists
        const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
        if (existingCode) {
            return res.json({ success: false, message: "Promo code already exists" });
        }

        const promoCode = new PromoCode({
            code: code.toUpperCase(),
            discountAmount: Number(discountAmount),
            discountType,
            minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
            maxDiscount: maxDiscount ? Number(maxDiscount) : null,
            validUntil: new Date(validUntil)
        });

        await promoCode.save();
        res.json({ success: true, message: "Promo code created successfully", data: promoCode });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating promo code" });
    }
}

// List all promo codes
export const listPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: promoCodes });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching promo codes" });
    }
}

// Validate promo code
export const validatePromoCode = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        
        const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });
        
        if (!promoCode) {
            return res.json({ success: false, message: "Invalid promo code" });
        }

        // Check if code is expired
        if (new Date(promoCode.validUntil) < new Date()) {
            return res.json({ success: false, message: "Promo code has expired" });
        }

        // Check minimum order amount
        if (orderAmount < promoCode.minOrderAmount) {
            return res.json({ 
                success: false, 
                message: `Minimum order amount of ₹${promoCode.minOrderAmount} required` 
            });
        }

        res.json({ success: true, message: "Promo code applied successfully", data: promoCode });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error validating promo code" });
    }
}

// Delete promo code
export const deletePromoCode = async (req, res) => {
    try {
        const { codeId } = req.body;
        await PromoCode.findByIdAndDelete(codeId);
        res.json({ success: true, message: "Promo code deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting promo code" });
    }
}