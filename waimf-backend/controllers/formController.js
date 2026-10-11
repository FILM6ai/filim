import formSchema from "../modles/form.js";

// POST: Create a new form submission
export const createFormPost = async (req, res) => {
  try {
    const { firstName, lastName, email, topic, message, phone } = req.body;

    if (!firstName || !lastName || !email || !topic || !message) {
      return res.status(400).json({
        success: false,
        error: "Please fill all the required fields",
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Message cannot exceed 1000 characters.",
      });
    }

    const newForm = new formSchema({
      firstName,
      lastName,
      email,
      topic,
      message,
      phone,
    });

    await newForm.save();

    // Sirf database mein save karo — email EmailJS frontend se bhejega
    res.status(201).json({
      success: true,
      form: newForm,
      message: "Form submitted successfully",
    });
  } catch (error) {
    console.error("Error creating form submission:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create form submission",
    });
  }
};

// GET: Retrieve all form submissions
export const createFormGet = async (req, res) => {
  try {
    const forms = await formSchema.find({});
    res.status(200).json({
      success: true,
      forms,
      message: "Form submissions fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch form submissions" });
  }
};

// DELETE: Single form submission
export const deleteFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await formSchema.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Form not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ success: false, error: "Failed to delete form" });
  }
};

// DELETE: Multiple (bulk) form submissions
export const deleteMultipleForms = async (req, res) => {
  try {
    const { ids } = req.body; // array of IDs

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: "No IDs provided" });
    }

    await formSchema.deleteMany({ _id: { $in: ids } });

    res
      .status(200)
      .json({ success: true, message: "Forms deleted successfully" });
  } catch (error) {
    console.error("Error deleting forms:", error);
    res.status(500).json({ success: false, error: "Failed to delete forms" });
  }
};
