// routes/newsRoutes.js

import express from 'express';
import upload from '../middlewere/multer.js';
import {
  createNewsPage,
  getNewsPage,
  updateNewsPage,
} from '../controllers/newsController.js';
import validateFileSize from '../middlewere/validateFileSize.js';
import {
  deleteVideoSectionItem,
  getVideoSection,
  updateVideoSection,
} from '../controllers/videoSectionController.js';
import newsSchema from '../modles/news.js';

const newRoute = express.Router();

newRoute.get('/getnews', getNewsPage);
newRoute.post(
  '/newsRoute',
  upload.fields([
    {
      name: 'heroImage',
      maxCount: 1,
    },
  ]),
    validateFileSize,
  createNewsPage
);

// New update route to update a news page by its ID
newRoute.put(
  '/update/:id',
  upload.fields([
    {
      name: 'heroImage',
      maxCount: 1,
    },
  ]),
    validateFileSize,
  updateNewsPage
);

// The video block lives on its own routes because the page update endpoints above
// rebuild the whole document - see videoSectionController.js.
newRoute.get('/videosection', getVideoSection(newsSchema));
newRoute.put('/videosection/:id', updateVideoSection(newsSchema));
newRoute.delete('/videosection/:id', deleteVideoSectionItem(newsSchema));

export default newRoute;
