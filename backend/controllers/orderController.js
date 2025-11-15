import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Placing user order for frontend
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod = "online" } = req.body;

        // Validate required fields
        if (!userId || !items || !amount || !address) {
            return res.json({ 
                success: false, 
                message: "Missing required fields: userId, items, amount, or address" 
            });
        }

        // Create new order
        const newOrder = new orderModel({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            paymentMethod: paymentMethod
        });

        await newOrder.save();

        // Clear user's cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // If payment method is COD, return success immediately
        if (paymentMethod === "cod") {
            return res.json({
                success: true,
                message: "Order placed successfully with Cash on Delivery",
                orderId: newOrder._id,
                paymentMethod: "cod"
            });
        }

        // For online payment, create Razorpay order
        const razorpayAmount = amount * 100; // Convert to paise

        const options = {
            amount: razorpayAmount,
            currency: "INR",
            receipt: newOrder._id.toString(),
        };

        console.log("Creating Razorpay order with amount:", razorpayAmount);

        const razorOrder = await razorpay.orders.create(options);

        res.json({
            success: true,
            orderId: newOrder._id,
            razorpayOrderId: razorOrder.id,
            amount: amount,
            key: process.env.RAZORPAY_KEY_ID,
            paymentMethod: "online"
        });

    } catch (error) {
        console.log("Place order error:", error);
        res.json({ 
            success: false, 
            message: "Error placing order: " + error.message 
        });
    }
};

// Verifying Razorpay payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            // If payment failed, delete the order
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log("Verify order error:", error);
        res.json({ success: false, message: "Error verifying payment" });
    }
};

// user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.body.userId});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
}

// Listing orders for Admin Panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error fetching orders"})
    }
}

// api for updating order status
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error updating status"})
    }
}

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { orderId, paymentMethod } = req.body;
        
        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        
        // Check if order can be cancelled (only in Food Processing status)
        if (order.status !== 'Food Processing') {
            return res.json({ success: false, message: "Order cannot be cancelled at this stage" });
        }
        
        // Update order status to cancelled
        order.status = 'Cancelled';
        await order.save();
        
        res.json({ 
            success: true, 
            message: "Order cancelled successfully",
            refundProcess: paymentMethod === 'online' ? 'Refund will be processed within 5-7 business days' : 'Order cancelled successfully'
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error cancelling order" });
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, cancelOrder };