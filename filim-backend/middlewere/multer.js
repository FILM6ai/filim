// import multer from 'multer';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './upload');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// export const upload = multer({
//   storage,
// });



// import multer from 'multer';

// const storage = multer.diskStorage({
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   },
// });

// const upload = multer({ storage });

// export default upload;



// import multer from 'multer';

// const storage = multer.diskStorage({
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   },
// });


// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 8 * 1024 * 1024 * 1024,

//     fieldSize: 800 * 1024 * 1024,
//   },
// });
// export default upload;


import multer from 'multer';

const IMAGE_MAX_SIZE = 5 * 1024 * 1024;   // 5MB images ke liye
const VIDEO_MAX_SIZE = 20 * 1024 * 1024;  // 20MB videos ke liye

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

// File type aur size check karne wala function
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');

  // Na image na video ho toh reject karo
  if (!isImage && !isVideo) {
    return cb(new Error('Sirf image ya video upload kar sakte hain'), false);
  }

  // File size check ke liye file ka reference save karo
  file.isImage = isImage;
  file.isVideo = isVideo;

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: VIDEO_MAX_SIZE, // max limit video wali rakhte hain (50MB)
    fieldSize: 800 * 1024 * 1024,
  },
});

export default upload;