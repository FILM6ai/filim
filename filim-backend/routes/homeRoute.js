import express from "express";
import {
  createGetHome,
  createHomePage,
  deleteHomeImage,
  updateHomePage,
} from "../controllers/homeController.js";
import upload from "../middlewere/multer.js";
import validateFileSize from "../middlewere/validateFileSize.js";

const homeRouter = express.Router();

homeRouter.get("/gethome", createGetHome);
homeRouter.post(
  "/homeRoute",
  upload.fields([
    {
      name: "heroImage",
      maxCount: 10,
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
      name: "videoPlayer",
      maxCount: 10,   // Multiple videos allow
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
  createHomePage,
);

homeRouter.put(
  "/homeupdate/:id",
  upload.fields([
    {
      name: "heroImage",
      maxCount: 10,
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
      name: "videoPlayer",
      maxCount: 10,
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
  updateHomePage,
);
homeRouter.delete("/deleteimage/:id", deleteHomeImage);

export default homeRouter;
