import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import promoRouter from './routes/promoRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter)
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/promo", promoRouter)

app.get("/", (req, res) => {
    res.json({ 
        success: true, 
        message: "Food Delivery API is working!",
        timestamp: new Date().toISOString()
    })
})

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ 
        success: true, 
        message: "Server is healthy",
        timestamp: new Date().toISOString()
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: "Route not found" 
    });
});

// Only start server if not in Vercel
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    app.listen(port, () => {
        console.log(`Server Started on http://localhost:${port}`)
    })
}

export default app;