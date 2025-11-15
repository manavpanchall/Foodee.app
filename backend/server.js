import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import promoRouter from './routes/promoRoute.js';
import 'dotenv/config';

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://food-delivery-app-delta-indol.vercel.app/",
        "https://your-admin-app.vercel.app"
    ],
    credentials: true
}));

// DB connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/promo", promoRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        message: "Server is healthy",
        timestamp: new Date().toISOString()
    });
});

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
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: "API endpoint not found" 
    });
});

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server Started on http://localhost:${port}`);
    });
}

export default app;