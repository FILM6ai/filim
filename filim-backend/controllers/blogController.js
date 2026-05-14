import blogSchema from '../modles/blog.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import * as cheerio from 'cheerio';


export const createBlog = async (req, res) => {
  try {
    const { title, date, author, content: rawHtml, alt, youtubeUrl} = req.body;

    console.log('Incoming blog post data');
    console.log('Title:', title);
    console.log('Author:', author);
    console.log('Date:', date);
    console.log('Content Length:', rawHtml?.length);
    console.log('Files:', Object.keys(req.files || {}));

    // Basic required fields check
    if (!title || !author || !rawHtml || !date) {
      const msg = 'Missing required fields';
      console.warn(msg);
      return res.status(400).json({ success: false, message: msg });
    }

    // Check cover image
    if (!req.files || !req.files.image || !req.files.image[0]) {
      const msg = 'Cover image is required';
      console.warn(msg, req.files);
      return res.status(400).json({ success: false, message: msg });
    }

    // Upload cover image
    const coverImagePath = req.files.image[0].path;
    console.log('Uploading cover image from:', coverImagePath);

    const coverUpload = await uploadOnCloudinary(coverImagePath);
    const coverImageUrl = coverUpload?.secure_url || coverUpload?.url;

    if (!coverImageUrl) {
      const msg = 'Failed to upload cover image';
      console.error(msg, coverUpload);
      return res.status(500).json({ success: false, message: msg });
    }

    console.log('Cover image uploaded to:', coverImageUrl);

    // Upload base64 images inside content
    const $ = cheerio.load(rawHtml);
    const imgTags = $('img[src^="data:"]');

    console.log(`Found ${imgTags.length} base64 images to upload in content`);

    await Promise.all(
      imgTags.toArray().map(async (img, index) => {
        const dataUri = $(img).attr('src');

        try {
          const uploaded = await uploadOnCloudinary(dataUri);
          const newUrl = uploaded?.secure_url || uploaded?.url;
          $(img).attr('src', newUrl);
          console.log(`Image ${index + 1} uploaded: ${newUrl}`);
        } catch (imgErr) {
          console.error(`Error uploading image ${index + 1}`, imgErr);
          throw new Error('Failed to upload embedded image to Cloudinary');
        }
      })
    );

const cleanedHtml = $('body').html();

    // Save blog
    const newBlog = await blogSchema.create({
      title,
      date,
      author,
      alt,
      content: cleanedHtml,
      image: coverImageUrl,
      youtubeUrl: youtubeUrl || '',
    });

    console.log('Blog saved with ID:', newBlog._id);

    return res.status(201).json({
      success: true,
      blog: newBlog,
      message: 'Blog post created successfully',
    });
  } catch (error) {
    const errMsg = error.message || 'Unknown server error';
    console.error('Blog post creation failed:', errMsg);
    return res.status(500).json({
      success: false,
      message: `Failed to create blog post: ${errMsg}`,
    });
  }
};



export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
const { title, author, content: rawHtml, alt, date, youtubeUrl } = req.body;
    console.log(req.body, 'update data');

    const blogToUpdate = await blogSchema.findById(id);
    if (!blogToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // If a new cover image is uploaded
    if (req.files?.image?.[0]?.path) {
      const imagePath = req.files.image[0].path;
      const uploadResponse = await uploadOnCloudinary(imagePath);
      blogToUpdate.image = uploadResponse.secure_url || uploadResponse.url;
    }

    // If new content is provided, handle embedded base64 image upload
    if (rawHtml) {
      const $ = cheerio.load(rawHtml);
      const imgTags = $('img[src^="data:"]');

      await Promise.all(
        imgTags.toArray().map(async (img) => {
          const dataUri = $(img).attr('src');
          const uploaded = await uploadOnCloudinary(dataUri);
          $(img).attr('src', uploaded.secure_url || uploaded.url);
        })
      );

blogToUpdate.content = $('body').html();
    }

    // Update other fields if provided
    blogToUpdate.title = title || blogToUpdate.title;
    blogToUpdate.author = author || blogToUpdate.author;
    blogToUpdate.alt = alt || blogToUpdate.alt;
    blogToUpdate.date = date || blogToUpdate.date;
    blogToUpdate.youtubeUrl = youtubeUrl !== undefined ? youtubeUrl : blogToUpdate.youtubeUrl;

    const updatedBlog = await blogToUpdate.save();

    return res.status(200).json({
      success: true,
      blog: updatedBlog,
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
    });
  }
};

// export const updateBlog = async (req, res) => {
//   try {
//     // Extract blog id from URL parameters and updated data from the request body.
//     const { id } = req.params;
//     const { title, author, content, alt, date } = req.body;
//     console.log(req.body, 'update data');

//     // Retrieve the blog post to update.
//     const blogToUpdate = await blogSchema.findById(id);
//     if (!blogToUpdate) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog post not found',
//       });
//     }

//     // If a new image file is uploaded, handle the file upload.
//     if (req.files?.image) {
//       const imagePath = req.files.image[0].path;
//       const uploadResponse = await uploadOnCloudinary(imagePath);
//       blogToUpdate.image = uploadResponse.secure_url;
//     }

//     // Update the blog post with new data, if provided.
//     blogToUpdate.title = title || blogToUpdate.title;
//     blogToUpdate.author = author || blogToUpdate.author;
//     blogToUpdate.content = content || blogToUpdate.content;
//     blogToUpdate.alt = alt || blogToUpdate.alt;
//     blogToUpdate.date = date || blogToUpdate.date;

//     // Save the updated blog post.
//     const updatedBlog = await blogToUpdate.save();

//     return res.status(200).json({
//       success: true,
//       blog: updatedBlog,
//       message: 'Blog post updated successfully',
//     });
//   } catch (error) {
//     console.error('Error updating blog:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to update blog post',
//     });
//   }
// };

export const getBlogs = async (req, res) => {
  try {
    const blogs = await blogSchema.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      blogs,
      message: 'Blog posts fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts',
    });
  }
};

/**
 * Delete a blog post by id.
 */
// chnges
export const deleteBlog = async (req, res) => {
  try {
    // Extract blog id from URL parameters.
    const { id } = req.params;

    // Find and delete the blog post.
    const deletedBlog = await blogSchema.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete blog post',
    });
  }
};
