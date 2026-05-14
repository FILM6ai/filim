import express from 'express';
import upload from '../middlewere/multer.js';
import { createFooter, getFooter, updateFooter } from '../controllers/footerController.js';


const footerRouter = express.Router();
 footerRouter.get('/footer', getFooter);
  footerRouter.post('/footer',  upload.fields([
    { name: 'logoImage', maxCount: 1 },
    { name: 'tiktokIcon', maxCount: 1 },
    { name: 'youtubeIcon', maxCount: 1 },
    { name: 'instaIcon', maxCount: 1 },
    { name: 'twitterIcon', maxCount: 1 },
  ]), createFooter); footerRouter.put(
  '/footer/:id',
  upload.fields([
    { name: 'logoImage', maxCount: 1 },
    { name: 'tiktokIcon', maxCount: 1 },
    { name: 'youtubeIcon', maxCount: 1 },
    { name: 'instaIcon', maxCount: 1 },
    { name: 'twitterIcon', maxCount: 1 },
  ]),
  updateFooter
);


export default footerRouter;
