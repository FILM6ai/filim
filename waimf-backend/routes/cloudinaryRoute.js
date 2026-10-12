import express from "express";
import { getSignature, cloudinaryStatus } from "../controllers/cloudinaryController.js";

const router = express.Router();

router.post("/sign", getSignature);
// Yes/no only, never a value - see the controller.
router.get("/status", cloudinaryStatus);

export default router;


