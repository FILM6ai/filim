import express from 'express';
import upload from '../middlewere/multer.js';
import { createFaqPage, createGetFaq, updateFaqPage } from '../controllers/faqController.js';

const faqRoute = express.Router();

faqRoute.get('/faqgetroute', createGetFaq);
faqRoute.post(
  '/faqpostroute',
  upload.fields([{ name: 'heroImage', maxCount: 1 }]),
  createFaqPage
);
faqRoute.put(
  '/faqupdateroute/:id',
  upload.fields([{ name: 'heroImage', maxCount: 1 }]),
  updateFaqPage
);

export default faqRoute;
