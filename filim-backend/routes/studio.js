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

export default studioRoute;
