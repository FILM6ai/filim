import express from 'express';
import upload from '../middlewere/multer.js';
import { createNavbar, getNavbar, updateNavbar } from '../controllers/navbarController.js';


const navbarRouter = express.Router();

navbarRouter.get('/navbar', getNavbar);
navbarRouter.post('/navbar',  upload.fields([
    { name: 'logoImage', maxCount: 1 },
    { name: 'tiktokIcon', maxCount: 1 },
    { name: 'youtubeIcon', maxCount: 1 },
    { name: 'instaIcon', maxCount: 1 },
    { name: 'twitterIcon', maxCount: 1 },
  ]), createNavbar);
navbarRouter.put(
  '/navbar/:id',
  upload.fields([
    { name: 'logoImage', maxCount: 1 },
    { name: 'tiktokIcon', maxCount: 1 },
    { name: 'youtubeIcon', maxCount: 1 },
    { name: 'instaIcon', maxCount: 1 },
    { name: 'twitterIcon', maxCount: 1 },
  ]),
  updateNavbar
);


export default navbarRouter;
