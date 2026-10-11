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

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set - the WAIMF backend cannot start');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: DB_NAME });
    // Logged on every boot so which database this is talking to is never a
    // guess - it is the first thing to check if the two sites ever appear to
    // share content.
    console.log(`MongoDB connected successfully (database: ${mongoose.connection.name})`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
