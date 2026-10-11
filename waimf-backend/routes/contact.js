import express from 'express';
import upload from '../middlewere/multer.js';
import {
  createContactPage,
  createGetContact,
  updateContactPage,
} from '../controllers/contactController.js';
import validateFileSize from '../middlewere/validateFileSize.js';

const contactRoute = express.Router();

contactRoute.get('/getcontact', createGetContact);
contactRoute.post(
  '/contatcRoute',
  upload.fields([{ name: 'heroImage', maxCount: 1 }]),
    validateFileSize,
  createContactPage
);
contactRoute.put(
  '/updateContact/:id',
  upload.fields([{ name: 'heroImage', maxCount: 1 }]),
    validateFileSize,
  updateContactPage
);

export default contactRoute;
