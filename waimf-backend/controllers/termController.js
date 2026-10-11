import termSchema from '../modles/terms.js';

export const createtermPage = async (req, res) => {
  try {
    const { content } = req.body;
    console.log(req.body, 'req body faq');
    const termModel = new termSchema({
      content,
    });
    const termData = await termModel.save();

    return res.status(200).json({
      success: true,
      termData,
      message: 'termData page uploaded successfully',
    });
  } catch (error) {
    console.error('Error creating termData:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to create termData' });
  }
};

export const createGetterm = async (req, res) => {
  try {
    const termData = await termSchema.find({});
    console.log(termData, 'termData');

    res.status(200).json({
      success: true,
      termData,
      message: 'termData page get successfully',
    });
  } catch (error) {
    console.error('Error fetching termData:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to fetch termData' });
  }
};

export const updateTermPage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    console.log(content, 'content');

    const existingTerm = await termSchema.findById(id);
    if (!existingTerm) {
      return res.status(404).json({
        success: false,
        message: 'Terms data page not found',
      });
    }

    // Ensure content is properly structured for MongoDB
    const updateContent = await termSchema.findByIdAndUpdate(
      id,
      { $set: { content } }, // Fix applied here
      { new: true }
    );

    return res.status(200).json({
      success: true,
      termData: updateContent,
      message: 'Terms data page updated successfully',
    });
  } catch (error) {
    console.error('Error updating terms page:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update terms page',
    });
  }
};

