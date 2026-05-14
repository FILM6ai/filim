import express from "express";
import upload from "../middlewere/multer.js";
import {
  createGetService,
  createServicePage,
  deleteServiceImage,
  updateServicePage,
} from "../controllers/serviceController.js";
import validateFileSize from "../middlewere/validateFileSize.js";

const serviceRoute = express.Router();

serviceRoute.get("/getservice", createGetService);
serviceRoute.put(
  "/updateservice/:id",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "advanceImage", maxCount: 1 },
    { name: "toplistImage", maxCount: 1 },
    { name: "robotImage", maxCount: 1 },
    { name: "competateImage", maxCount: 1 },
    { name: "runwayImage", maxCount: 1 },
  ]),
  validateFileSize,
  updateServicePage,
);

serviceRoute.post(
  "/serviceRoute",
  upload.fields([
    {
      name: "heroImage",
      maxCount: 1,
    },
    {
      name: "advanceImage",
      maxCount: 1,
    },
    {
      name: "toplistImage",
      maxCount: 1,
    },
    {
      name: "robotImage",
      maxCount: 1,
    },
    {
      name: "competateImage",
      maxCount: 1,
    },
    {
      name: "runwayImage",
      maxCount: 1,
    },
  ]),
  validateFileSize,
  createServicePage,
);

serviceRoute.delete("/deleteimage/:id", deleteServiceImage);
export default serviceRoute;
