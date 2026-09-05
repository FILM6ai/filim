// routes/studioRoute.js

import express from 'express';
import upload from '../middlewere/multer.js';
import {
  createGetStudio,
  createStudioPage,
  deleteStudioImage,
  updateStudioPage,
} from '../controllers/studioController.js';
import validateFileSize from '../middlewere/validateFileSize.js';
import {
  deleteVideoSectionItem,
  getVideoSection,
  updateVideoSection,
} from '../controllers/videoSectionController.js';
import studioSchema from '../modles/studio.js';

const studioRoute = express.Router();

studioRoute.get('/getstudio', createGetStudio);
studioRoute.post(
  '/studioRoute',
  upload.fields([
    {name:'card1Image',maxCount:1},
    {name:'card2Image',maxCount:1},
    {name:'card3Image',maxCount:1},
    {name:'card4Image',maxCount:1},
    {name:'card5Image',maxCount:1},
    {name:'card6Image',maxCount:1},
    { name: 'heroImage', maxCount: 10 },
    { name: 'toplistImage', maxCount: 1 },
    { name: 'toplistImage2', maxCount: 1 },
    { name: 'competateImage', maxCount: 1 },
    { name: 'competateImage2', maxCount: 1 },
    { name: 'competateImage3', maxCount: 1 },
    { name: 'toplistImage3', maxCount: 1 },
  ]),
    validateFileSize,
  createStudioPage
);

// New update route
studioRoute.put(
  '/updateStudio/:id',
  upload.fields([
    { name: 'card1Image', maxCount: 1 },
    { name: 'card2Image', maxCount: 1 },
    { name: 'card3Image', maxCount: 1 },
    { name: 'card4Image', maxCount: 1 },
    { name: 'card5Image', maxCount: 1 },
    { name: 'card6Image', maxCount: 1 },
    { name: 'heroImage', maxCount: 10 },
    { name: 'toplistImage', maxCount: 1 },
    { name: 'toplistImage2', maxCount: 1 },
    { name: 'competateImage', maxCount: 1 },
    { name: 'competateImage2', maxCount: 1 },
    { name: 'competateImage3', maxCount: 1 },
    { name: 'toplistImage3', maxCount: 1 },
  ]),
    validateFileSize,
  updateStudioPage
);
studioRoute.delete('/deleteimage/:id', deleteStudioImage);

// The video block lives on its own routes because the page update endpoints above
// rebuild the whole document - see videoSectionController.js.
studioRoute.get('/videosection', getVideoSection(studioSchema));
studioRoute.put('/videosection/:id', updateVideoSection(studioSchema));
studioRoute.delete('/videosection/:id', deleteVideoSectionItem(studioSchema));

// The second video block, lower down the page. Same controller, different
// field - the write stays scoped to dotted `videos2.*` paths.
studioRoute.get('/videosection2', getVideoSection(studioSchema, 'videos2'));
studioRoute.put('/videosection2/:id', updateVideoSection(studioSchema, 'videos2'));
studioRoute.delete('/videosection2/:id', deleteVideoSectionItem(studioSchema, 'videos2'));

export default studioRoute;
