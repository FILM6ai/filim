import subscribeEmail from '../modles/subscribeEmail.js';

export const createEmailPost = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please fill all the required fields',
      });
    }

    const newEmail = new subscribeEmail({
      email,
    });

    await newEmail.save();

    res.status(201).json({
      success: true,
      email: newEmail,
      message: 'Email submitted successfully',
    });
  } catch (error) {
    console.error('Error creating email:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to create email' });
  }
};

export const getEmails = async (req, res) => {
  try {
    const emails = await subscribeEmail.find({});
    return res.status(200).json({
      success: true,
      emails,
      message: 'Emails fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to fetch emails' });
  }
};
