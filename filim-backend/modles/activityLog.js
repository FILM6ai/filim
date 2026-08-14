import mongoose from 'mongoose';

// A record of every change made through the API.
//
// The site had no edit history at all: when a page header was blanked in July
// there was no way to tell who had done it, when, or even whether it came from
// the admin panel or straight from the internet. This is that record.
const activityLogSchema = new mongoose.Schema(
  {
    // Who. Null when the request arrived with no valid token - which is itself
    // the interesting case, so it is stored rather than dropped.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
    userEmail: { type: String, default: null },

    // What.
    method: { type: String, required: true },
    path: { type: String, required: true },
    action: { type: String, default: '' },
    status: { type: Number, default: 0 },

    // Where from. Vercel puts the caller's address in x-forwarded-for.
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    origin: { type: String, default: '' },

    // True for requests that would have been rejected once enforcement is on.
    // During the grace period these are recorded and allowed through, so the
    // log shows in advance exactly what turning the lock on will break.
    unauthenticated: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Newest first is the only way this is ever read.
activityLogSchema.index({ createdAt: -1 });

export default mongoose.models.ActivityLog ||
  mongoose.model('ActivityLog', activityLogSchema);
