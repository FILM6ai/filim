import FaqSchema from '../modles/faq.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


export const createFaqPage = async (req, res) => {
  try {
    // Check if title and description are provided in the request body (simple JSON request)
    if (req.body.title && req.body.description) {
      const faqModel = new FaqSchema({
        faq: {
          title: req.body.title,
          description: req.body.description,
        },
      });
      const faqData = await faqModel.save();
      return res.status(200).json({
        success: true,
        faqData,
        message: 'FAQ created successfully',
      });
    } else {
      // Fallback: use the original logic if stringified data is provided
      const { faqhero, faq } = req.body;
      console.log(req.body, 'req body faq');

      const hero1 = JSON.parse(faqhero);
      const advance1 = JSON.parse(faq);

      let heroFile = req.files?.heroImage?.[0];
      let heroUploadResult;
      if (heroFile) {
        const isVideo = heroFile.mimetype && heroFile.mimetype.startsWith('video/');
        heroUploadResult = await uploadOnCloudinary(heroFile.path, {
          resource_type: isVideo ? 'video' : 'image',
        });
      }

      const faqModel = new FaqSchema({
        faqhero: {
          bgImage: heroUploadResult?.secure_url || hero1.bgImage || null,
          youtubeUrl: hero1.youtubeUrl || '',
          title: hero1.title,
          description: hero1.description,
          alt: hero1.alt,
        },
        faq: {
          title: advance1.title,
          description: advance1.description,
        },
      });
      const faqData = await faqModel.save();

      return res.status(200).json({
        success: true,
        faqData,
        message: 'FAQ page uploaded successfully',
      });
    }
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to create FAQ' });
  }
};




export const createGetFaq = async (req, res) => {
  try {
    const faqData = await FaqSchema.find({});
    console.log(faqData, 'faqData');

    res.status(200).json({
      success: true,
      faqData,
      message: 'faqData page get successfully',
    });
  } catch (error) {
    console.error('Error fetching faqData:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to fetch faqData' });
  }
};




export const updateFaqPage = async (req, res) => {
  try {
    const { id } = req.params;
    const existingFaq = await FaqSchema.findById(id);

    if (!existingFaq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ page not found',
      });
    }

    let updates = {};

    // If a simple JSON payload is sent, use it directly.
    if (req.body.title && req.body.description) {
      updates.faq = {
        title: req.body.title,
        description: req.body.description,
      };
    } else {
      // Fallback to the original logic if stringified fields are provided
      if (req.body.faqhero) {
        let heroData = JSON.parse(req.body.faqhero);
        // Handle optional file upload (image or video)
        const heroFile = req.files?.heroImage?.[0];
        if (heroFile) {
          const isVideo = heroFile.mimetype && heroFile.mimetype.startsWith('video/');
          const uploadResult = await uploadOnCloudinary(heroFile.path, {
            resource_type: isVideo ? 'video' : 'image',
          });
          heroData.bgImage = uploadResult?.secure_url || heroData.bgImage || existingFaq.faqhero?.bgImage;
        } else {
          // If admin explicitly sent an empty bgImage field, respect it; otherwise preserve existing
          heroData.bgImage = heroData.bgImage !== undefined ? heroData.bgImage : existingFaq.faqhero?.bgImage;
        }
        // youtubeUrl: allow clearing by sending empty string
        heroData.youtubeUrl = heroData.youtubeUrl !== undefined ? heroData.youtubeUrl : existingFaq.faqhero?.youtubeUrl || '';
        updates.faqhero = heroData;
      }

      if (req.body.faq) {
        let advanceData = JSON.parse(req.body.faq);
        updates.faq = advanceData;
      }
    }

    const updatedFaq = await FaqSchema.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      faq: updatedFaq,
      message: 'FAQ page updated successfully',
    });
  } catch (error) {
    console.error('Error updating FAQ page:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update FAQ page',
    });
  }
};