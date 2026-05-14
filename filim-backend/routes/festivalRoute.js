import express from "express";
import upload from "../middlewere/multer.js";
import {
  createGetFestival,
  createFestivalPage,
  updatedFestival,
  deleteFestivalImage,
  deleteCard,
} from "../controllers/festivalController.js";
import validateFileSize from "../middlewere/validateFileSize.js";

const festivalRoute = express.Router();

festivalRoute.get("/getfestival", createGetFestival);
festivalRoute.post(
  "/festivalRoute",
  upload.fields([
    {
      name: "heroImage",
      maxCount: 1,
    },
    { name: "cardImage0", maxCount: 1 },
    { name: "cardImage1", maxCount: 1 },
    { name: "cardImage2", maxCount: 1 },
    { name: "cardImage3", maxCount: 1 },
    { name: "cardImage4", maxCount: 1 },
    { name: "cardImage5", maxCount: 1 },
    { name: "cardImage6", maxCount: 1 },
    { name: "cardImage7", maxCount: 1 },
    { name: "cardImage8", maxCount: 1 },
    { name: "cardImage9", maxCount: 1 },
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
  createFestivalPage,
);

festivalRoute.put(
  "/updatefestival/:id",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "advanceImage", maxCount: 1 },
    { name: "cardImage0", maxCount: 1 },
    { name: "cardImage1", maxCount: 1 },
    { name: "cardImage2", maxCount: 1 },
    { name: "cardImage3", maxCount: 1 },
    { name: "cardImage4", maxCount: 1 },
    { name: "cardImage5", maxCount: 1 },
    { name: "cardImage6", maxCount: 1 },
    { name: "cardImage7", maxCount: 1 },
    { name: "cardImage8", maxCount: 1 },
    { name: "cardImage9", maxCount: 1 },
    { name: "toplistImage", maxCount: 1 },
    { name: "robotImage", maxCount: 1 },
    { name: "competateImage", maxCount: 1 },
    { name: "runwayImage", maxCount: 1 },
  ]),
  validateFileSize,
  updatedFestival,
);

festivalRoute.delete("/deleteimage/:id", deleteFestivalImage);
festivalRoute.delete("/deletecard/:id", deleteCard);
export default festivalRoute;
