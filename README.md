# 🍕 Foodee - Food Delivery Application

A full-stack food delivery platform built with the **MERN stack**,
featuring a modern customer interface, powerful admin panel, and robust
backend API.

## 🚀 Live Demo

Frontend: https://foodee-pied.vercel.app/


## ✨ Features

### 🎯 Customer Features

-   User Authentication -- Secure login/signup with JWT
-   Food Browsing -- Explore 25+ food categories
-   Smart Filtering -- Category, Veg/Non-Veg/Jain
-   Cart Management -- Add/remove items with real-time updates
-   Secure Payments -- Razorpay + COD
-   Order Tracking -- Real-time updates
-   Promo Codes -- Discount validation
-   Responsive UI -- Mobile-first

### ⚙️ Admin Features

-   Dashboard -- Statistics & overview
-   Food Management -- Add/edit/delete items
-   Order Management -- Process orders
-   Promo Codes -- Create/manage codes
-   Cloudinary image storage

## 🛠 Tech Stack

### Frontend

-   React, Vite, React Router, Context API, CSS3

### Backend

-   Node.js, Express.js, MongoDB, Mongoose, JWT

### Third-Party

-   Cloudinary, Razorpay, Vercel

## 📁 Project Structure

Food-Delivery-App/ ├── frontend/ ├── backend/ ├── admin/ └── README.md

## 🚀 Installation

### 1. Backend

cd backend\
npm install\
npm run dev

### 2. Frontend

cd frontend\
npm install\
npm run dev

### 3. Admin

cd admin\
npm install\
npm run dev

## 🔧 Environment Variables

### Backend (.env)

MONGODB_URL=\
JWT_SECRET=\
CLOUDINARY_CLOUD_NAME=\
CLOUDINARY_API_KEY=\
CLOUDINARY_API_SECRET=\
RAZORPAY_KEY_ID=\
RAZORPAY_KEY_SECRET=

### Frontend (.env)

VITE_API_URL=\
VITE_LOCAL_API_URL=http://localhost:4000

### Admin (.env)

VITE_API_URL=\
VITE_LOCAL_API_URL=http://localhost:4000\
VITE_ADMIN_EMAIL=\
VITE_ADMIN_PASSWORD=

## 📡 API Endpoints

### Authentication

POST /api/user/register\
POST /api/user/login

### Food

GET /api/food/list\
POST /api/food/add

### Cart

POST /api/cart/add\
POST /api/cart/remove

### Orders

POST /api/order/place\
POST /api/order/verify

### Promo

POST /api/promo/create\
POST /api/promo/validate

## 👨‍💻 Developer

Manav Panchal : (https://manavpanchall-portfolio.vercel.app)

GitHub: [@manavpanchal\](https://github.com/manavpanchall)

LinkedIn: (https://www.linkedin.com/in/manavpanchall)

## ⭐ Quick Start

cd backend && npm run dev\
cd frontend && npm run dev\
cd admin && npm run dev
