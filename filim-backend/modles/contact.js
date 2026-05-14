import mongoose from "mongoose";

const ContactPageSchema = new mongoose.Schema({
  hero: {
    bgImage: { type: String },
    title: { type: String },
    alt: { type: String },
    description: { type: String },
  },

  advance: {
    title: { type: String },
    description: { type: String },
  },
});

const contactSchema =
  mongoose.models.contact || mongoose.model('contact', ContactPageSchema);
export default contactSchema;
