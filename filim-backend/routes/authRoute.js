import express from 'express';
import {
  bootstrap,
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

// TEMPORARY - first-run setup only. Creates the first owner account and then
// refuses forever, because it checks that no account exists yet. Removed from
// this file once the real account is in place.
const SETUP_TOKEN = 'f6_setup_2Rk9Wq4Xm7Lp3Vt';
authRoute.post('/bootstrap', (req, res, next) => {
  if (req.query.token !== SETUP_TOKEN) {
    return res.status(404).json({ success: false, message: 'Not found.' });
  }
  return bootstrap(req, res, next);
});

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
