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
import {
  deleteVideoSectionItem,
  getVideoSection,
  updateVideoSection,
} from '../controllers/videoSectionController.js';
import festivalSchema from '../modles/festival.js';


// Award cards: one optional image each, posted as cardImage0, cardImage1, ...
//
// This used to be ten hard-coded names, so the ELEVENTH card - Best Hybrid,
// added in October 2026 - was posted as cardImage10, which multer rejected with
// LIMIT_UNEXPECTED_FILE. That failed the entire festival save, not just the
// card, with nothing on the website to show why. Thirty leaves room to grow;
// the limit is now one number in one place.
const MAX_CARDS = 30;
const cardImageFields = Array.from({ length: MAX_CARDS }, (_, i) => ({
  name: `cardImage${i}`,
  maxCount: 1,
}));

const festivalRoute = express.Router();

festivalRoute.get("/getfestival", createGetFestival);
festivalRoute.post(
  "/festivalRoute",
  upload.fields([
    ...cardImageFields,
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
    {
      name: "popupImage",
      maxCount: 1,
    },
    { name: "galleryImage0", maxCount: 1 },
    { name: "galleryImage1", maxCount: 1 },
    { name: "galleryImage2", maxCount: 1 },
    { name: "galleryImage3", maxCount: 1 },
    { name: "galleryImage4", maxCount: 1 },
    { name: "galleryImage5", maxCount: 1 },
    { name: "galleryImage6", maxCount: 1 },
    { name: "galleryImage7", maxCount: 1 },
    { name: "galleryImage8", maxCount: 1 },
    { name: "galleryImage9", maxCount: 1 },
    { name: "galleryImage10", maxCount: 1 },
    { name: "galleryImage11", maxCount: 1 },
    { name: "galleryImage12", maxCount: 1 },
    { name: "galleryImage13", maxCount: 1 },
    { name: "galleryImage14", maxCount: 1 },
    { name: "galleryImage15", maxCount: 1 },
    { name: "galleryImage16", maxCount: 1 },
    { name: "galleryImage17", maxCount: 1 },
    { name: "galleryImage18", maxCount: 1 },
    { name: "galleryImage19", maxCount: 1 },
    { name: "jurorImage0", maxCount: 1 },
    { name: "jurorImage1", maxCount: 1 },
    { name: "jurorImage2", maxCount: 1 },
    { name: "jurorImage3", maxCount: 1 },
    { name: "jurorImage4", maxCount: 1 },
    { name: "jurorImage5", maxCount: 1 },
    { name: "jurorImage6", maxCount: 1 },
    { name: "jurorImage7", maxCount: 1 },
    { name: "jurorImage8", maxCount: 1 },
    { name: "jurorImage9", maxCount: 1 },
    { name: "jurorImage10", maxCount: 1 },
    { name: "jurorImage11", maxCount: 1 },
    { name: "jurorImage12", maxCount: 1 },
    { name: "jurorImage13", maxCount: 1 },
    { name: "jurorImage14", maxCount: 1 },
    { name: "jurorImage15", maxCount: 1 },
    { name: "jurorImage16", maxCount: 1 },
    { name: "jurorImage17", maxCount: 1 },
    { name: "jurorImage18", maxCount: 1 },
    { name: "jurorImage19", maxCount: 1 },
  ]),
  validateFileSize,
  createFestivalPage,
);

festivalRoute.put(
  "/updatefestival/:id",
  upload.fields([
    ...cardImageFields,
    { name: "heroImage", maxCount: 1 },
    { name: "advanceImage", maxCount: 1 },
    { name: "toplistImage", maxCount: 1 },
    { name: "robotImage", maxCount: 1 },
    { name: "competateImage", maxCount: 1 },
    { name: "runwayImage", maxCount: 1 },
    { name: "popupImage", maxCount: 1 },
    { name: "toplistPopupImage", maxCount: 1 },
    { name: "robotPopupImage", maxCount: 1 },
    { name: "competatePopupImage", maxCount: 1 },
    { name: "galleryImage0", maxCount: 1 },
    { name: "galleryImage1", maxCount: 1 },
    { name: "galleryImage2", maxCount: 1 },
    { name: "galleryImage3", maxCount: 1 },
    { name: "galleryImage4", maxCount: 1 },
    { name: "galleryImage5", maxCount: 1 },
    { name: "galleryImage6", maxCount: 1 },
    { name: "galleryImage7", maxCount: 1 },
    { name: "galleryImage8", maxCount: 1 },
    { name: "galleryImage9", maxCount: 1 },
    { name: "galleryImage10", maxCount: 1 },
    { name: "galleryImage11", maxCount: 1 },
    { name: "galleryImage12", maxCount: 1 },
    { name: "galleryImage13", maxCount: 1 },
    { name: "galleryImage14", maxCount: 1 },
    { name: "galleryImage15", maxCount: 1 },
    { name: "galleryImage16", maxCount: 1 },
    { name: "galleryImage17", maxCount: 1 },
    { name: "galleryImage18", maxCount: 1 },
    { name: "galleryImage19", maxCount: 1 },
    { name: "jurorImage0", maxCount: 1 },
    { name: "jurorImage1", maxCount: 1 },
    { name: "jurorImage2", maxCount: 1 },
    { name: "jurorImage3", maxCount: 1 },
    { name: "jurorImage4", maxCount: 1 },
    { name: "jurorImage5", maxCount: 1 },
    { name: "jurorImage6", maxCount: 1 },
    { name: "jurorImage7", maxCount: 1 },
    { name: "jurorImage8", maxCount: 1 },
    { name: "jurorImage9", maxCount: 1 },
    { name: "jurorImage10", maxCount: 1 },
    { name: "jurorImage11", maxCount: 1 },
    { name: "jurorImage12", maxCount: 1 },
    { name: "jurorImage13", maxCount: 1 },
    { name: "jurorImage14", maxCount: 1 },
    { name: "jurorImage15", maxCount: 1 },
    { name: "jurorImage16", maxCount: 1 },
    { name: "jurorImage17", maxCount: 1 },
    { name: "jurorImage18", maxCount: 1 },
    { name: "jurorImage19", maxCount: 1 },
  ]),
  validateFileSize,
  updatedFestival,
);

festivalRoute.delete("/deleteimage/:id", deleteFestivalImage);
festivalRoute.delete("/deletecard/:id", deleteCard);
// The video block lives on its own routes because the page update endpoints above
// rebuild the whole document - see videoSectionController.js.
festivalRoute.get('/videosection', getVideoSection(festivalSchema));
festivalRoute.put('/videosection/:id', updateVideoSection(festivalSchema));
festivalRoute.delete('/videosection/:id', deleteVideoSectionItem(festivalSchema));

// The second video block, lower down the page. Same controller, different
// field - the write stays scoped to dotted `videos2.*` paths.
festivalRoute.get('/videosection2', getVideoSection(festivalSchema, 'videos2'));
festivalRoute.put('/videosection2/:id', updateVideoSection(festivalSchema, 'videos2'));
festivalRoute.delete('/videosection2/:id', deleteVideoSectionItem(festivalSchema, 'videos2'));

// Blocks three and four: under Festival Selection and under A Celebration of
// Human Talent & Technology. See the field map in modles/festival.js - the
// numbers are build order, not page order.
festivalRoute.get('/videosection3', getVideoSection(festivalSchema, 'videos3'));
festivalRoute.put('/videosection3/:id', updateVideoSection(festivalSchema, 'videos3'));
festivalRoute.delete('/videosection3/:id', deleteVideoSectionItem(festivalSchema, 'videos3'));

festivalRoute.get('/videosection4', getVideoSection(festivalSchema, 'videos4'));
festivalRoute.put('/videosection4/:id', updateVideoSection(festivalSchema, 'videos4'));
festivalRoute.delete('/videosection4/:id', deleteVideoSectionItem(festivalSchema, 'videos4'));

export default festivalRoute;
