import express from 'express';
import {
  login,
  me,
  changePassword,
  listUsers,
  createUser,
  updateUser,
  resetUserPassword,
  deleteUser,
  listActivity,
} from '../controllers/authController.js';
import { requireAuth } from '../middlewere/auth.js';

const authRoute = express.Router();

// The first-run setup route lived here. The owner account exists, so it is
// gone: a way to create an account without being signed in should not outlast
// the moment it was needed, even one that refuses once an account exists.
authRoute.post('/login', login);

authRoute.get('/me', requireAuth(), me);
authRoute.post('/change-password', requireAuth(), changePassword);

const ownerOnly = requireAuth({ roles: ['owner'] });
authRoute.get('/users', ownerOnly, listUsers);
authRoute.post('/users', ownerOnly, createUser);
authRoute.patch('/users/:id', ownerOnly, updateUser);
authRoute.post('/users/:id/reset-password', ownerOnly, resetUserPassword);
authRoute.delete('/users/:id', ownerOnly, deleteUser);

authRoute.get('/activity', ownerOnly, listActivity);

export default authRoute;
