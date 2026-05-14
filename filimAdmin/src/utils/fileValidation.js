const IMAGE_MAX_SIZE = 5 * 1024 * 1024;   // 5MB
const VIDEO_MAX_SIZE = 20 * 1024 * 1024;  // 20MB

export const validateFile = (file) => {
  if (!file) return { valid: false, message: 'no file selected' };

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (isImage && file.size > IMAGE_MAX_SIZE) {
    return { valid: false, message: 'Image should not exceed 5 MB.' };
  }

  if (isVideo && file.size > VIDEO_MAX_SIZE) {
    return { valid: false, message: 'Video should not exceed 20 MB.' };
  }

  return { valid: true, message: '' };
};