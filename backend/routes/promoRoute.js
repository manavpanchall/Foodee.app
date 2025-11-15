import express from "express";
import { createPromoCode, listPromoCodes, validatePromoCode, deletePromoCode } from "../controllers/promoController.js";

const promoRouter = express.Router();

promoRouter.post("/create", createPromoCode);
promoRouter.get("/list", listPromoCodes);
promoRouter.post("/validate", validatePromoCode);
promoRouter.post("/delete", deletePromoCode);

export default promoRouter;