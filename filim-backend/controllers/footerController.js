import Footer from "../modles/footer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


export const createFooter = async (req, res) => {
  try {
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

    const newFooter = new Footer({
      description: req.body.description,
      logo: logoUrl,
      links,
      tiktokIcon: tiktokIconUrl,
      youtubeIcon: youtubeIconUrl,
      instaIcon: instaIconUrl,
      twitterIcon: twitterIconUrl,
    });

    const savedFooter = await newFooter.save();

    return res.status(200).json({
      success: true,
      Footer: savedFooter,
      message: 'Footer created successfully',
    });
  } catch (error) {
    console.error('Error creating Footer:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create Footer',
    });
  }
};


// get footer 


export const getFooter = async (req, res) => {
  try {
    const footer = await Footer.find({});
    return res.status(200).json({
      success: true,
      footer,
      message: 'Footer fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching Footer:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Footer',
    });
  }
};



// update 


export const updateFooter = async (req, res) => {
  try {
    const { id } = req.params;
    const {description} = req.body
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
      const uploadResult = await uploadOnCloudinary(
        req.files.tiktokIcon[0].path
      );
      updates.tiktokIcon = uploadResult?.secure_url;
    }
    if (req.files && req.files.youtubeIcon && req.files.youtubeIcon.length) {
      const uploadResult = await uploadOnCloudinary(
        req.files.youtubeIcon[0].path
      );
      updates.youtubeIcon = uploadResult?.secure_url;
    }
    if (req.files && req.files.instaIcon && req.files.instaIcon.length) {
      const uploadResult = await uploadOnCloudinary(
        req.files.instaIcon[0].path
      );
      updates.instaIcon = uploadResult?.secure_url;
    }
    if (req.files && req.files.twitterIcon && req.files.twitterIcon.length) {
      const uploadResult = await uploadOnCloudinary(
        req.files.twitterIcon[0].path
      );
      updates.twitterIcon = uploadResult?.secure_url;
    }

        updates.description = description;

    const updatedFooter = await Footer.findByIdAndUpdate(

      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedFooter) {
      return res.status(404).json({
        success: false,
        message: 'Footer not found',
      });
    }

    return res.status(200).json({
      success: true,
      Footer: updatedFooter,
      message: 'Footer updated successfully',
    });
  } catch (error) {
    console.error('Error updating Footer:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update Footer',
    });
  }
};