import express from 'express';
import { createGetterm, createtermPage, updateTermPage }
 from '../controllers/termController.js';
import validateFileSize from '../middlewere/validateFileSize.js';

const termRoute = express.Router();

termRoute.get('/getterm', createGetterm);
termRoute.post(
  '/postterm',
    validateFileSize,
  createtermPage
);
termRoute.put(
  '/updateterm/:id',
    validateFileSize,
  updateTermPage
);

export default termRoute;
