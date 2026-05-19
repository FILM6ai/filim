const IMAGE_MAX_SIZE = 5 * 1024 * 1024;       // normal images
const BLOG_IMAGE_MAX_SIZE = 10 * 1024 * 1024; // blog images
const VIDEO_MAX_SIZE = 20 * 1024 * 1024;

const validateFileSize = (req, res, next) => {
  if (!req.files && !req.file) return next();

  const allFiles = req.files
    ? Object.values(req.files).flat()
    : [req.file];

  for (const file of allFiles) {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    // BLOG ROUTES → 10MB
    if (
      req.originalUrl.includes("/blog") &&
      isImage &&
      file.size > BLOG_IMAGE_MAX_SIZE
    ) {
      return res.status(400).json({
        success: false,
        message: "Blog image should not exceed 10MB",
      });
    }

    // OTHER IMAGES → 5MB
    if (
      !req.originalUrl.includes("/blog") &&
      isImage &&
      file.size > IMAGE_MAX_SIZE
    ) {
      return res.status(400).json({
        success: false,
        message: `"${file.fieldname}" image max 5MB`,
      });
    }

    // VIDEOS → 20MB
    if (isVideo && file.size > VIDEO_MAX_SIZE) {
      return res.status(400).json({
        success: false,
        message: `"${file.fieldname}" video max 20MB`,
      });
    }
  }

  next();
};

export default validateFileSize;