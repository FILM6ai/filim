import express from 'express';
import { createFormPost, createFormGet, deleteFormById, deleteMultipleForms } from '../controllers/formController.js';

const formRoute = express.Router();

formRoute.get('/getform', createFormGet);
formRoute.post('/formRoute', createFormPost);
formRoute.delete('/deleteform/:id', deleteFormById); 
formRoute.delete('/deleteforms', deleteMultipleForms);

export default formRoute;
