// TEMPORARY - remove together with controllers/dbMigrateController.js once the
// database has been moved into the client's own MongoDB account.
import express from 'express';
import { migrateDatabase, whichDatabase } from '../controllers/dbMigrateController.js';
import { requireAuth } from '../middlewere/auth.js';

const dbMigrateRoute = express.Router();

// Signed-in only, and on top of that a token that is not guessable from the
// public repository. Two locks on a door that will be bricked up shortly.
const MIGRATE_TOKEN = 'f6_dbmove_8Qv3Xn7Rk2Lm9Wt';

const tokenGate = (req, res, next) =>
  req.query.token === MIGRATE_TOKEN
    ? next()
    : res.status(404).json({ success: false, message: 'Not found.' });

// GET can only ever report. Writing requires POST *and* ?apply=1, so no amount
// of polling, prefetching or a mistyped URL can copy anything by accident -
// which is exactly how I clobbered a live field on this project once before.
dbMigrateRoute.get('/db', tokenGate, requireAuth(), migrateDatabase);
dbMigrateRoute.post('/db', tokenGate, requireAuth(), migrateDatabase);
dbMigrateRoute.get('/where', tokenGate, requireAuth(), whichDatabase);

export default dbMigrateRoute;
