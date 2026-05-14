import nodemailer from "nodemailer";

// Create a reusable function
const sendEmail = async (
  to,
  subject,
  firstName,
  lastName,
  email,
  topic,
  message,
  phone,
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "contact@gmail.com", // Your Gmail
        pass: "cnotgxdydouetkrk", // Your App Password
      },
    });

    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Karachi",
      dateStyle: "full",
      timeStyle: "short",
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;">
        <h2 style="color: #333;">New Form Submission</h2>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Topic:</strong> ${topic}</p>
        <p><strong>Message:</strong></p>
        <p style="border-left: 4px solid #007BFF; padding-left: 10px; color: #555;">${message}</p>
        <p><strong>Submitted At:</strong> ${submittedAt}</p>
        <hr>
        <p style="font-size: 12px; color: #888;">This is an automated email from your form submission system.</p>
      </div>
    `;

    // Email details
    const mailOptions = {
      from: "contact@gmail.com",
      to,
      subject,
      html: htmlContent, // Use HTML template
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info.response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Export the function
export default sendEmail;
