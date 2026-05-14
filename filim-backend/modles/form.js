import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  topic: {
    type: String,
    required: true,
    enum: [
      'general',
      'inquiries',
      'partnership',
      'press',
      'production',
      'submission',
      'support',
      'token',
    ],
  },
message: { type: String, required: true, maxlength: [1000, 'Message cannot exceed 1000 characters'] },
}, { timestamps: true });

const formSchema = mongoose.models.Form || mongoose.model('Form', FormSchema);
export default formSchema;
