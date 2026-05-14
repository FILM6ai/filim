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

      let heroVideoPath = req.files?.heroImage?.[0]?.path;

      if (heroVideoPath) {
        heroVideoPath = await uploadOnCloudinary(heroVideoPath, {
          resource_type: 'video',
        });
      }

      const faqModel = new FaqSchema({
        faqhero: {
          bgImage: heroVideoPath?.secure_url,
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
        if (req.files && req.files.heroImage && req.files.heroImage.length) {
          const heroFilePath = req.files.heroImage[0].path;
          const uploadResult = await uploadOnCloudinary(heroFilePath, {
            resource_type: 'video',
          });
          heroData.bgImage = uploadResult?.secure_url;
        } else {
          heroData.bgImage = existingFaq.faqhero?.bgImage;
        }
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