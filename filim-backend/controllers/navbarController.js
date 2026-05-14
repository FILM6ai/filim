// import { uploadOnCloudinary } from '../utils/cloudinary.js';
// import Navbar from '../modles/navbar.js';

// // Create a new Navbar
// export const createNavbar = async (req, res) => {
//   try {
//     let parsedLinks;
//     if (req.body.links) {
//       parsedLinks = JSON.parse(req.body.links);
//     } else {
//       parsedLinks = [
//         { name: 'Service', link: req.body.service },
//         { name: 'Studio', link: req.body.studio },
//         { name: 'Festival', link: req.body.festival },
//         { name: 'News', link: req.body.news },
//         { name: 'Contact', link: req.body.contact },
//       ];
//     }

//     let logoUrl = '';
//     const logoImagePath = req.files?.logoImage?.[0]?.path;
//     if (logoImagePath) {
//       const uploadResult = await uploadOnCloudinary(logoImagePath);
//       logoUrl = uploadResult?.secure_url;
//     }

//     // Handle the four icon uploads
//     let tiktokIconUrl = '';
//     let youtubeIconUrl = '';
//     let instaIconUrl = '';
//     let twitterIconUrl = '';

//     if (req.files && req.files.tiktokIcon && req.files.tiktokIcon.length) {
//       const uploadResult = await uploadOnCloudinary(
//         req.files.tiktokIcon[0].path
//       );
//       tiktokIconUrl = uploadResult?.secure_url;
//     }
//     if (req.files && req.files.youtubeIcon && req.files.youtubeIcon.length) {
//       const uploadResult = await uploadOnCloudinary(
//         req.files.youtubeIcon[0].path
//       );
//       youtubeIconUrl = uploadResult?.secure_url;
//     }
//     if (req.files && req.files.instaIcon && req.files.instaIcon.length) {
//       const uploadResult = await uploadOnCloudinary(
//         req.files.instaIcon[0].path
//       );
//       instaIconUrl = uploadResult?.secure_url;
//     }
//     if (req.files && req.files.twitterIcon && req.files.twitterIcon.length) {
//       const uploadResult = await uploadOnCloudinary(
//         req.files.twitterIcon[0].path
//       );
//       twitterIconUrl = uploadResult?.secure_url;
//     }

//     const newNavbar = new Navbar({
//       logo: logoUrl,
//       links: parsedLinks,
//       tiktokIcon: tiktokIconUrl,
//       youtubeIcon: youtubeIconUrl,
//       instaIcon: instaIconUrl,
//       twitterIcon: twitterIconUrl,
//     });

//     const savedNavbar = await newNavbar.save();

//     return res.status(200).json({
//       success: true,
//       navbar: savedNavbar,
//       message: 'Navbar created successfully',
//     });
//   } catch (error) {
//     console.error('Error creating navbar:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to create navbar',
//     });
//   }
// };

// export const updateNavbar = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = {};

//     // Update the logo image if provided
//     if (req.files && req.files.logoImage && req.files.logoImage.length) {
//       const logoImagePath = req.files.logoImage[0].path;
//       const uploadResult = await uploadOnCloudinary(logoImagePath);
//       updates.logo = uploadResult?.secure_url;
//     }

//     if (req.body.links) {
//       updates.links = JSON.parse(req.body.links);
//     } else {
//       updates.links = [
//         { name: 'Service', link: req.body.service },
//         { name: 'Studio', link: req.body.studio },
//         { name: 'Festival', link: req.body.festival },
//         { name: 'News', link: req.body.news },
//         { name: 'Contact', link: req.body.contact },
//       ];
//     }

//     if (req.files && req.files.tiktokIcon && req.files.tiktokIcon.length) {
//       const uploadResult = await uploadOnCloudinary(
//         req.files.tiktokIcon[0].path
//       );
//       updates.tiktokIcon = uploadResult?.secure_url;
//     }
//     if (req.files && req.files.youtubeIcon && req.files.youtubeIcon.length) {
//       const uploadResult = await uploadOnCloudinary(
//         req.files.youtubeIcon[0].path
//       );
//       updates.youtubeIcon = uploadResult?.secure_url;
//     }
//     if (req.files && req.files.instaIcon && req.files.instaIcon.length) {
//       const uploadResult = await uploadOnCloudinary(
//         req.files.instaIcon[0].path
//       );
//       updates.instaIcon = uploadResult?.secure_url;
//     }
//     if (req.files && req.files.twitterIcon && req.files.twitterIcon.length) {
//       const uploadResult = await uploadOnCloudinary(
//         req.files.twitterIcon[0].path
//       );
//       updates.twitterIcon = uploadResult?.secure_url;
//     }

//     const updatedNavbar = await Navbar.findByIdAndUpdate(
//       id,
//       { $set: updates },
//       { new: true }
//     );

//     if (!updatedNavbar) {
//       return res.status(404).json({
//         success: false,
//         message: 'Navbar not found',
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       navbar: updatedNavbar,
//       message: 'Navbar updated successfully',
//     });
//   } catch (error) {
//     console.error('Error updating navbar:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to update navbar',
//     });
//   }
// };


// // Get the Navbar (if only one exists, it will return an array with one document)
// export const getNavbar = async (req, res) => {
//   try {
//     const navbar = await Navbar.find({});
//     return res.status(200).json({
//       success: true,
//       navbar,
//       message: 'Navbar fetched successfully',
//     });
//   } catch (error) {
//     console.error('Error fetching navbar:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch navbar',
//     });
//   }
// };























import { uploadOnCloudinary } from '../utils/cloudinary.js';
import Navbar from '../modles/navbar.js';

// Create a new Navbar
export const createNavbar = async (req, res) => {
  try {
    // Instead of parsing the old links (service, studio, etc.), we now build the links array from the new fields.
    // Commented out old logic:
    // let parsedLinks;
    // if (req.body.links) {
    //   parsedLinks = JSON.parse(req.body.links);
    // } else {
    //   parsedLinks = [
    //     { name: 'Service', link: req.body.service },
    //     { name: 'Studio', link: req.body.studio },
    //     { name: 'Festival', link: req.body.festival },
    //     { name: 'News', link: req.body.news },
    //     { name: 'Contact', link: req.body.contact },
    //   ];
    // }

    // New links array for the four icons:
    const links = [
      { name: 'TikTok', link: req.body.tiktokLink || '' },
      { name: 'YouTube', link: req.body.youtubeLink || '' },
      { name: 'Instagram', link: req.body.instaLink || '' },
      { name: 'Twitter', link: req.body.twitterLink || '' },
    ];

    let logoUrl = '';
    const logoImagePath = req.files?.logoImage?.[0]?.path;
    if (logoImagePath) {
      const uploadResult = await uploadOnCloudinary(logoImagePath);
      logoUrl = uploadResult?.secure_url;
    }

    // Handle icon uploads for TikTok, YouTube, Instagram, and Twitter
    let tiktokIconUrl = '';
    let youtubeIconUrl = '';
    let instaIconUrl = '';
    let twitterIconUrl = '';

    if (req.files && req.files.tiktokIcon && req.files.tiktokIcon.length) {
      const uploadResult = await uploadOnCloudinary(
        req.files.tiktokIcon[0].path
      );
      tiktokIconUrl = uploadResult?.secure_url;
    }
    if (req.files && req.files.youtubeIcon && req.files.youtubeIcon.length) {
      const uploadResult = await uploadOnCloudinary(
        req.files.youtubeIcon[0].path
      );
      youtubeIconUrl = uploadResult?.secure_url;
    }
    if (req.files && req.files.instaIcon && req.files.instaIcon.length) {
      const uploadResult = await uploadOnCloudinary(
        req.files.instaIcon[0].path
      );
      instaIconUrl = uploadResult?.secure_url;
    }
    if (req.files && req.files.twitterIcon && req.files.twitterIcon.length) {
      const uploadResult = await uploadOnCloudinary(
        req.files.twitterIcon[0].path
      );
      twitterIconUrl = uploadResult?.secure_url;
    }

    const newNavbar = new Navbar({
      logo: logoUrl,
      links, // now holds the four new icon links
      tiktokIcon: tiktokIconUrl,
      youtubeIcon: youtubeIconUrl,
      instaIcon: instaIconUrl,
      twitterIcon: twitterIconUrl,
    });

    const savedNavbar = await newNavbar.save();

    return res.status(200).json({
      success: true,
      navbar: savedNavbar,
      message: 'Navbar created successfully',
    });
  } catch (error) {
    console.error('Error creating navbar:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create navbar',
    });
  }
};









// Get the Navbar (if only one exists, it will return an array with one document)
export const getNavbar = async (req, res) => {
  try {
    const navbar = await Navbar.find({});
    return res.status(200).json({
      success: true,
      navbar,
      message: 'Navbar fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching navbar:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch navbar',
    });
  }
};








// Update existing Navbar document
export const updateNavbar = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    // Update the logo image if provided
    if (req.files && req.files.logoImage && req.files.logoImage.length) {
      const logoImagePath = req.files.logoImage[0].path;
      const uploadResult = await uploadOnCloudinary(logoImagePath);
      updates.logo = uploadResult?.secure_url;
    }

    // New links array:
    updates.links = [
      { name: 'TikTok', link: req.body.tiktokLink || '' },
      { name: 'YouTube', link: req.body.youtubeLink || '' },
      { name: 'Instagram', link: req.body.instaLink || '' },
      { name: 'Twitter', link: req.body.twitterLink || '' },
    ];

    if (req.files && req.files.tiktokIcon && req.files.tiktokIcon.length) {
      const uploadResult = await uploadOnCloudinary(req.files.tiktokIcon[0].path);
      updates.tiktokIcon = uploadResult?.secure_url;
    }
    if (req.files && req.files.youtubeIcon && req.files.youtubeIcon.length) {
      const uploadResult = await uploadOnCloudinary(req.files.youtubeIcon[0].path);
      updates.youtubeIcon = uploadResult?.secure_url;
    }
    if (req.files && req.files.instaIcon && req.files.instaIcon.length) {
      const uploadResult = await uploadOnCloudinary(req.files.instaIcon[0].path);
      updates.instaIcon = uploadResult?.secure_url;
    }
    if (req.files && req.files.twitterIcon && req.files.twitterIcon.length) {
      const uploadResult = await uploadOnCloudinary(req.files.twitterIcon[0].path);
      updates.twitterIcon = uploadResult?.secure_url;
    }

    const updatedNavbar = await Navbar.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedNavbar) {
      return res.status(404).json({
        success: false,
        message: 'Navbar not found',
      });
    }

    return res.status(200).json({
      success: true,
      navbar: updatedNavbar,
      message: 'Navbar updated successfully',
    });
  } catch (error) {
    console.error('Error updating navbar:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update navbar',
    });
  }
};
