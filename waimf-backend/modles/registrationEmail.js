import mongoose from 'mongoose';

const registrationEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('registrationEmail', registrationEmailSchema);