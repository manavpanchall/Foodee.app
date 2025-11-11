import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            paymentMethod: req.body.paymentMethod || "online" // Add this
        });
        await newOrder.save();

        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const options = {
            amount: req.body.amount * 100, // Convert rupees to paise (₹410 → 41000)
            currency: "INR",
            receipt: newOrder._id.toString(),
        };

        const razorOrder = await razorpay.orders.create(options);

        res.json({
            success: true,
            orderId: newOrder._id,
            razorpayOrderId: razorOrder.id,
            amount: req.body.amount, // Send amount in rupees to frontend
            key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Verifying Razorpay payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders }); // Fixed: success:true
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Listing orders for Admin Panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}


export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };