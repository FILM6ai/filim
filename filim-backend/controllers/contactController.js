import contactSchema from '../modles/contact.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
export const createContactPage = async (req, res) => {
  try {
    const { hero, advance } = req.body;
    const hero1 = JSON.parse(hero);
    const advance1 = JSON.parse(advance);

    let heroVideoPath = req.files?.heroImage[0]?.path;

    console.log(req.files.heroImage, 'heroImage');

    if (heroVideoPath) {
      heroVideoPath = await uploadOnCloudinary(heroVideoPath, {
        resource_type: 'video',
      });
    }

    const newContact = new contactSchema({
      hero: {
        bgImage: heroVideoPath?.secure_url,
        title: hero1.title,
        alt: hero1.alt,
        description: hero1.description,
      },
      advance: {
        title: advance1.title,
        description: advance1.description,
      },
    });
    const contact = await newContact.save();

    res.status(200).json({
      success: true,
      contact,
      message: 'contact page uploaded successfully',
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to fetch contact' });
  }
};

export const createGetContact = async (req, res) => {
  try {
    const contact = await contactSchema.find({});
    console.log(contact, 'contact');

    res.status(200).json({
      success: true,
      contact,
      message: 'contact page get successfully',
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to fetch contact' });
  }
};



export const updateContactPage = async (req, res) => {
  try {
    const { id } = req.params;
    const existingContact = await contactSchema.findById(id);

    if (!existingContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact page not found',
      });
    }

    const updates = {};

    if (req.body.hero) {
      let heroData = JSON.parse(req.body.hero);
      if (req.files && req.files.heroImage && req.files.heroImage.length) {
        const heroFilePath = req.files.heroImage[0].path;
        const uploadResult = await uploadOnCloudinary(heroFilePath, {
          resource_type: 'video',
        });
        heroData.bgImage = uploadResult?.secure_url;
      } else {
        heroData.bgImage = existingContact.hero?.bgImage;
      }
      updates.hero = heroData;
    }

    if (req.body.advance) {
      let advanceData = JSON.parse(req.body.advance);
      updates.advance = advanceData;
    }
    const updatedContact = await contactSchema.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      contact: updatedContact,
      message: 'Contact page updated successfully',
    });
  } catch (error) {
    console.error('Error updating contact page:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update contact page',
    });
  }
};