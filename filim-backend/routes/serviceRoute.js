import express from "express";
import upload from "../middlewere/multer.js";
import {
  createGetService,
  createServicePage,
  deleteServiceImage,
  updateServicePage,
} from "../controllers/serviceController.js";
import validateFileSize from "../middlewere/validateFileSize.js";
import {
  deleteVideoSectionItem,
  getVideoSection,
  updateVideoSection,
} from '../controllers/videoSectionController.js';
import serviceSchema from '../modles/service.js';

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
// The video block lives on its own routes because the page update endpoints above
// rebuild the whole document - see videoSectionController.js.
serviceRoute.get('/videosection', getVideoSection(serviceSchema));
serviceRoute.put('/videosection/:id', updateVideoSection(serviceSchema));
serviceRoute.delete('/videosection/:id', deleteVideoSectionItem(serviceSchema));

// The second video block, lower down the page. Same controller, different
// field - the write stays scoped to dotted `videos2.*` paths.
serviceRoute.get('/videosection2', getVideoSection(serviceSchema, 'videos2'));
serviceRoute.put('/videosection2/:id', updateVideoSection(serviceSchema, 'videos2'));
serviceRoute.delete('/videosection2/:id', deleteVideoSectionItem(serviceSchema, 'videos2'));

export default serviceRoute;
