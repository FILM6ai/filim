import express from 'express';
import {
  login,
  setup,
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

authRoute.post('/login', login);

// First run only - creates the one owner account in an empty database. It
// refuses once any account exists AND requires SETUP_TOKEN. Delete this line
// and the controller once the account is made.
authRoute.post('/setup', setup);

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
