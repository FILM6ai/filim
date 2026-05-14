// middlewere/validateFileSize.js

const IMAGE_MAX_SIZE = 5 * 1024 * 1024;   // 5MB
const VIDEO_MAX_SIZE = 20 * 1024 * 1024;  // 20MB

const validateFileSize = (req, res, next) => {
  if (!req.files && !req.file) return next();

  // req.files object hota hai jab upload.fields() use ho
  const allFiles = req.files
    ? Object.values(req.files).flat()
    : [req.file];

  for (const file of allFiles) {
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');

    if (isImage && file.size > IMAGE_MAX_SIZE) {
      return res.status(400).json({
        success: false,
        message: `"${file.fieldname}" image 5MB Should not exceed this.`,
      });
    }

    if (isVideo && file.size > VIDEO_MAX_SIZE) {
      return res.status(400).json({
        success: false,
        message: `"${file.fieldname}" video 20MB Should not exceed this.`,
      });
    }
  }

  next();
};

export default validateFileSize;