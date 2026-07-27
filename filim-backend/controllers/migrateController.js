// TEMPORARY one-off: switch the Home hero from the YouTube stopgap to the real
// uploaded video on the active Cloudinary account. Token-gated, supports ?dry=1.
// Safe to delete after use.
import mongoose from "mongoose";
import homeModel from "../modles/home.js";

const TOKEN = "f6_home_7Zx2Qm9Kp4Lw";
const NEW_HOME_VIDEO =
  "https://res.cloudinary.com/rgwnsnby/video/upload/c_limit,w_1920,q_auto/site-headers/header_home.mp4";

export const fixHome = async (req, res) => {
  try {
    if (req.query.token !== TOKEN) {
      return res.status(403).json({ success: false, message: "forbidden" });
    }
    const dry = req.query.dry === "1" || req.query.dry === "true";
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const docs = await homeModel.find({}).lean();
    let changed = 0;
    const details = [];

    for (const doc of docs) {
      const bg = doc?.hero?.bgImage;
      if (Array.isArray(bg) && bg.some((u) => typeof u === "string" && u.includes("youtube"))) {
        details.push({ _id: String(doc._id), from: bg, to: [NEW_HOME_VIDEO] });
        changed++;
        if (!dry) {
          const { _id, ...rest } = doc;
          rest.hero = { ...rest.hero, bgImage: [NEW_HOME_VIDEO] };
          await homeModel.replaceOne({ _id }, rest);
        }
      }
    }

    return res.status(200).json({ success: true, version: "home-v1", dry, docsScanned: docs.length, changed, details });
  } catch (error) {
    console.error("fixHome error:", error);
    return res.status(500).json({ success: false, message: String(error?.message || error) });
  }
};

export default { fixHome };
