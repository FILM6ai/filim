// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"


// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         //upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         // file has been uploaded successfull
//         //console.log("file is uploaded on cloudinary ", response.url);
//         fs.unlinkSync(localFilePath)
//         return response;

//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
//         return null;
//     }
// }



// export {uploadOnCloudinary}























import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, options = {}) => {
  try {
    if (!localFilePath) return null;

    if (Array.isArray(localFilePath)) {
      const results = await Promise.all(
        localFilePath.map((file) => uploadOnCloudinary(file, options)),
      );
      return results.filter(Boolean);
    }

    const uploadOptions = { resource_type: 'auto', ...options };

    
    if (typeof localFilePath !== 'string') {
      return null;
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary environment variables are missing');
    }

    if (!fs.existsSync(localFilePath)) {
      throw new Error(`Local file not found for upload: ${localFilePath}`);
    }

    const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error('Cloudinary upload failed:', error.message || error);
    return null;
  }
};

export { uploadOnCloudinary };

export default cloudinary;
