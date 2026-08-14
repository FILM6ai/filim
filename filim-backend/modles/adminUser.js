import mongoose from 'mongoose';

// One document per person who can edit the site. Replaces the single shared
// password that used to sit in the admin panel's client-side JavaScript.
const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },

    // scrypt hash, never the password itself. See utils/authTokens.js.
    passwordHash: { type: String, required: true, select: false },

    // 'owner' can manage other accounts and read the activity log.
    // 'editor' can edit site content only.
    role: { type: String, enum: ['owner', 'editor'], default: 'editor' },

    // Set on accounts created by someone else. The admin panel refuses to do
    // anything else until the person picks their own password, so the
    // temporary one that was sent to them stops working straight away.
    mustChangePassword: { type: Boolean, default: false },

    // Preferred over deleting: keeps the activity log's references meaningful.
    disabled: { type: Boolean, default: false },

    // Bumping this invalidates every token already issued to the account.
    // Changing a password, disabling an account or a forced sign-out all bump it.
    tokenVersion: { type: Number, default: 0 },

    // Brute-force protection. Serverless instances share no memory, so the
    // counter has to live in the database to be worth anything.
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },

    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.models.AdminUser ||
  mongoose.model('AdminUser', adminUserSchema);
