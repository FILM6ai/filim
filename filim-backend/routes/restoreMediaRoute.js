// TEMPORARY route for the one-off dead-Cloudinary media restore. Remove after use.
import express from "express";
import { restoreMedia } from "../controllers/restoreMediaController.js";

const restoreMediaRouter = express.Router();
restoreMediaRouter.get("/media", restoreMedia);

export default restoreMediaRouter;
