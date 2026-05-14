import mongoose from 'mongoose';

const FaqPageSchema = new mongoose.Schema({
  faqhero: {
    bgImage: { type: String },
    title: { type: String },
    description: { type: String },
    alt: { type: String },
  },

  faq: {
    title: { type: String },
    description: { type: String },
  },
});

const FaqSchema = mongoose.models.faq || mongoose.model('faq', FaqPageSchema);
export default FaqSchema;
