import registrationEmail from '../modles/registrationEmail.js';

// POST — Hero button se email save karo
export const createRegistration = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please fill all the required fields',
      });
    }

    const newRegistration = new registrationEmail({
      email,
    });

    await newRegistration.save();

    res.status(201).json({
      success: true,
      email: newRegistration,
      message: 'Registration submitted successfully',
    });

  } catch (error) {
    console.error('Error creating registration:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create registration',
    });
  }
};

// GET — Admin panel mein registrations dikhao
export const getRegistrations = async (req, res) => {
  try {
    const emails = await registrationEmail.find({});
    return res.status(200).json({
      success: true,
      emails,
      message: 'Registrations fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations',
    });
  }
};