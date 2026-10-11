import express from 'express';
import {
  createRegistration,
  getRegistrations,
} from '../controllers/registrationController.js';

const registrationRoute = express.Router();

// Hero se email aayegi yahan
registrationRoute.post('/postregistration', createRegistration);

// Admin panel yahan se data lega
registrationRoute.get('/getregistration', getRegistrations);

export default registrationRoute;