import mongoose, { Schema } from 'mongoose';

const blogSchema = new Schema(
  {
    title: { type: String },
    alt: { type: String },
    author: { type: String },
    content: { type: String },
    image: { type: String },
    date: { type: String },
    youtubeUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const Blog = mongoose.models.blog || mongoose.model('blog', blogSchema);

export default Blog;
