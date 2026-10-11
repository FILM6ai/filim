import express from 'express';
import { createEmailPost, getEmails } from '../controllers/subscribeEmailController.js';

const emailRoute = express.Router();

emailRoute.get('/getemail', getEmails);
emailRoute.post('/postemail', createEmailPost);

export default emailRoute;
