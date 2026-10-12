import mongoose from 'mongoose';

// WAIMF's own database.
//
// ⚠ THE TRAP THIS GUARDS AGAINST:
// The obvious way to configure this backend is to paste the same MONGODB_URI
// that FILM6 uses. That connection string carries a database name, so doing so
// would quietly point this "separate" backend at FILM6's database - two
// backends writing the same collections, which is precisely what separating
// them was meant to prevent. Nothing would error; it would just silently not
// be separate.
//
// So the database name is set HERE, in code, rather than trusted to the end of
// a pasted URI. `dbName` overrides whatever the connection string says, so the
// same URI can safely be used for both and they still land in different
// databases. WAIMF_DB_NAME exists only so it can be changed without a deploy.
const DB_NAME = (process.env.WAIMF_DB_NAME || 'waimf').trim();

// ⚠ NO process.exit() HERE.
//
// This runs as a Vercel function. The copy inherited from FILM6 called
// process.exit(1) on any connection error, so one slow DNS lookup or a blip at
// Atlas on a cold start KILLED the function - the visitor got
// FUNCTION_INVOCATION_FAILED, and it was seen on the very first request after
// this backend was deployed.
//
// Instead the connection is a cached promise. A failure clears the cache, so
// the NEXT request simply tries again, and a request that arrives while it is
// down gets a clean 503 rather than a crashed process.
let pending = null;

const connectDB = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);
  if (pending) return pending;

  if (!process.env.MONGODB_URI) {
    return Promise.reject(new Error('MONGODB_URI is not set'));
  }

  pending = mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 15000,
    })
    .then((m) => {
      // Logged on every cold start so which database this is talking to is
      // never a guess.
      console.log(`MongoDB connected successfully (database: ${m.connection.name})`);
      return m;
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message);
      pending = null; // let the next request try again
      throw error;
    });

  return pending;
};

export default connectDB;
