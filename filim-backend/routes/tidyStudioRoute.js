// TEMPORARY route for the one-off studio bgImage cleanup. Remove after use.
import express from "express";
import { tidyStudio } from "../controllers/tidyStudioController.js";

const tidyStudioRouter = express.Router();
tidyStudioRouter.get("/studio-bgimages", tidyStudio);

export default tidyStudioRouter;
