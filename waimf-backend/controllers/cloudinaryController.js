import crypto from "crypto";
import "dotenv/config.js";
import { v2 as cloudinary } from "cloudinary";

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

// Is Cloudinary set up on THIS backend, and do the credentials actually work?
//
// Public on purpose, and safe to be: it answers yes/no and never returns a
// value. It exists because "Upload failed" in the panel has four different
// causes - a missing variable, a wrong secret, a missing cloud name in the
// panel's build, or Cloudinary itself - and the signing route that would tell
// them apart needs a signed-in admin. This tells them apart for anyone.
//
// `credentialsWork` comes from Cloudinary's own ping with the key and secret,
// so a secret that is present but WRONG is caught too - which is the case a
// presence check alone would wave through.

export const cloudinaryStatus = async (req, res) => {
  const present = {
    CLOUDINARY_CLOUD_NAME: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    CLOUDINARY_API_KEY: Boolean(process.env.CLOUDINARY_API_KEY),
    CLOUDINARY_API_SECRET: Boolean(process.env.CLOUDINARY_API_SECRET),
  };
  let credentialsWork = false;
  let reason = "";
  if (Object.values(present).every(Boolean)) {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const pong = await cloudinary.api.ping();
      credentialsWork = pong?.status === "ok";
    } catch (error) {
      // Cloudinary's message ("Invalid api_key", "api_secret mismatch") names
      // the problem without containing the secret.
      reason = String(error?.error?.message || error?.message || "ping failed").slice(0, 120);
    }
  } else {
    reason = "missing: " + Object.keys(present).filter((k) => !present[k]).join(", ");
  }
  return res.status(200).json({ success: true, present, credentialsWork, reason });
};
