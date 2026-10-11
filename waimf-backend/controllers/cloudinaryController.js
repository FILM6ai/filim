import crypto from "crypto";
import "dotenv/config.js";

export const getSignature = async (req, res) => {
  try {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!apiSecret || !apiKey || !cloudName) {
      return res.status(500).json({ success: false, message: "Cloudinary config missing on server" });
    }

    
    const timestamp = Math.round(new Date().getTime() / 1000);
    // Basic signature with only timestamp. If you need to sign more params, include them sorted as key=value&...
    const stringToSign = `timestamp=${timestamp}`;
    const signature = crypto.createHash("sha1").update(stringToSign + apiSecret).digest("hex");

    return res.status(200).json({ success: true, signature, timestamp, apiKey, cloudName });
  } catch (error) {
    console.error("Signature error:", error);
    return res.status(500).json({ success: false, message: "Failed to create signature" });
  }
};

export default { getSignature };
