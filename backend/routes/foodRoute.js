import express from "express";
import { addFood, listFood, removeFood, updateFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Use memory storage instead of disk storage for Vercel
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.post("/update", upload.single("image"), updateFood);

export default foodRouter;