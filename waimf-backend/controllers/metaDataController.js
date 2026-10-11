import MetaData from '../modles/metaData.js';

export const postmetaData = async (req, res) => {
  try {
    // Expecting the client to send { page, title, description }
    const { page, title, description } = req.body;
    console.log(req.body,'body ');

    // Build payload with empty defaults for all pages.
    const payload = {
      home: { title: '', description: '' },
      studio: { title: '', description: '' },
      services: { title: '', description: '' },
      festival: { title: '', description: '' },
      news: { title: '', description: '' },
      contact: { title: '', description: '' },
      blog: { title: '', description: '' },
      faq: { title: '', description: '' },
      terms: { title: '', description: '' },
    };

    // Override the specific page with the provided data.
    payload[page.toLowerCase()] = { title, description };

    const newDocument = new MetaData(payload);
    const savedDocument = await newDocument.save();
    res.status(201).json({
      success: true,
      data: savedDocument,
      message: 'Document created successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET: Fetch all meta data documents
export const getmetaData = async (req, res) => {
  try {
    const documents = await MetaData.find({});
    res.status(200).json({
      success: true,
      data: documents,
      message: 'Documents fetched successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT: Update an existing meta data document by ID


export const updatemetaData = async (req, res) => {
  try {
    const { id } = req.params;
    // Expecting the client to send { page, title, description }
    const { page, title, description } = req.body;
    const pageKey = page.toLowerCase();

    // Build an update payload that updates only the specific page field.
    const updatePayload = { [pageKey]: { title, description } };

    const updatedDocument = await MetaData.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: updatedDocument,
      message: 'Document updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


