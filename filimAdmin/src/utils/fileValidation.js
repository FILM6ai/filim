const IMAGE_MAX_SIZE = 5 * 1024 * 1024;   // 5MB
const VIDEO_MAX_SIZE = 20 * 1024 * 1024;  // 20MB
// Header uploads go straight from the browser to Cloudinary, so their only
// real ceiling is Cloudinary's 100 MB per file - room for a proper 1080p clip.
// Uploads that pass through the backend keep the lower limit.
export const DIRECT_VIDEO_MAX_SIZE = 100 * 1024 * 1024;  // 100MB

export const validateFile = (file, { videoMax = VIDEO_MAX_SIZE } = {}) => {
  if (!file) return { valid: false, message: 'no file selected' };

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (isImage && file.size > IMAGE_MAX_SIZE) {
    return { valid: false, message: 'Image should not exceed 5 MB.' };
  }

  if (isVideo && file.size > videoMax) {
    return { valid: false, message: `Video should not exceed ${Math.round(videoMax / 1024 / 1024)} MB.` };
  }

  return { valid: true, message: '' };
};

const BLOG_IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const validateBlogFile = (file) => {
  if (!file) return { valid: false, message: 'no file selected' };

  const isImage = file.type.startsWith('image/');

  if (!isImage) {
    return { valid: false, message: 'Only image files are allowed.' };
  }

  if (file.size > BLOG_IMAGE_MAX_SIZE) {
    return { valid: false, message: 'Image should not exceed 10 MB.' };
  }

  return { valid: true, message: '' };
};