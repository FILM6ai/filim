import express from 'express';
import upload from '../middlewere/multer.js';
import { createBlog, deleteBlog, getBlogs, updateBlog } from '../controllers/blogController.js';
import validateFileSize from '../middlewere/validateFileSize.js';

const blogRoute = express.Router();

blogRoute.get('/getblog', getBlogs);
blogRoute.delete('/getdelete/:id', deleteBlog);

blogRoute.post(
  '/blogroute',
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),
    validateFileSize,
  createBlog
);

blogRoute.put(
  '/blogrouteupdate/:id',
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),
    validateFileSize,
  updateBlog
);
export default blogRoute;
