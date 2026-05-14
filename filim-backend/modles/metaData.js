import mongoose from 'mongoose';

const MetaDataSchema = new mongoose.Schema(
  {
    home: {
      title: { type: String },
      description: { type: String },
    },
    studio: {
      title: { type: String },
      description: { type: String },
    },
    services: {
      title: { type: String },
      description: { type: String },
    },
    festival: {
      title: { type: String },
      description: { type: String },
    },
    news: {
      title: { type: String },
      description: { type: String },
    },
    contact: {
      title: { type: String },
      description: { type: String },
    },
    blog: {
      title: { type: String },
      description: { type: String },
    },
    faq: {
      title: { type: String },
      description: { type: String },
    },
    terms: {
      title: { type: String },
      description: { type: String },
    },
  },
  { timestamps: true }
);

const MetaData =
  mongoose.models.MetaData || mongoose.model('MetaData', MetaDataSchema);
export default MetaData;
