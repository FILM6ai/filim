import mongoose from 'mongoose';
import { videoSectionFields } from './videoSection.js';

const NewsPageSchema = new mongoose.Schema({
  videos: { ...videoSectionFields },

  bgImage: { type: String },
  title: { type: String },
  alt: { type: String },
  description: { type: String },
});

const newsSchema =
  mongoose.models.news || mongoose.model('news', NewsPageSchema);
export default newsSchema;
