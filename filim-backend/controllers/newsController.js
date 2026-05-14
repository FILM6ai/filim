// controllers/newsController.js

import newsSchema from '../modles/news.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const createNewsPage = async (req, res) => {
  try {
    const { title, alt,description } = req.body;
    let videoPath = req.files?.heroImage?.[0]?.path;
    console.log(req.files?.heroImage, 'heroImage');

    let secureUrl = '';
    if (videoPath) {
      const uploadResult = await uploadOnCloudinary(videoPath, {
        resource_type: 'video',
      });
      secureUrl = uploadResult?.secure_url;
    }

    const newNews = new newsSchema({
      bgImage: secureUrl,
      title: title,
      alt: alt,
      description: description,
    });

    const news = await newNews.save();

    res.status(200).json({
      success: true,
      news,
      message: 'News page uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading news page:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to upload news page',
    });
  }
};

export const getNewsPage = async (req, res) => {
  try {
    const news = await newsSchema.find({});
    console.log(news, 'news');

    res.status(200).json({
      success: true,
      news,
      message: 'News page retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching news page:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch news page',
    });
  }
};

// New update API to update a news page by id
export const updateNewsPage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, alt,description } = req.body;

    // Check for new hero image upload
    let videoPath = req.files?.heroImage?.[0]?.path;
    let secureUrl = '';
    if (videoPath) {
      const uploadResult = await uploadOnCloudinary(videoPath, {
        resource_type: 'video',
      });
      secureUrl = uploadResult?.secure_url;
    }
    
    // Build an update object with provided fields
    const updateData = {};
    if (title) updateData.title = title;
    if (alt) updateData.alt = alt;
    if (description !== undefined) updateData.description = description;

    if (secureUrl) updateData.bgImage = secureUrl;

    // Update news document and return the updated document
    const updatedNews = await newsSchema.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedNews) {
      return res.status(404).json({
        success: false,
        message: 'News page not found',
      });
    }

    res.status(200).json({
      success: true,
      news: updatedNews,
      message: 'News page updated successfully',
    });
  } catch (error) {
    console.error('Error updating news page:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update news page',
    });
  }
};
