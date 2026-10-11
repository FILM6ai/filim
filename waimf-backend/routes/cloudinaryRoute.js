import express from "express";
import { getSignature } from "../controllers/cloudinaryController.js";

const router = express.Router();

router.post("/sign", getSignature);

export default router;


