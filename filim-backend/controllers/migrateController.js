// TEMPORARY: set the Home hero bgImage to a given Cloudinary URL (used to tune
// home header video quality/source). Token-gated, validates the URL, ?dry=1.
// Safe to delete once home header is finalized.
import mongoose from "mongoose";
import homeModel from "../modles/home.js";

const TOKEN = "f6_home_7Zx2Qm9Kp4Lw";

export const setHome = async (req, res) => {
  try {
    if (req.query.token !== TOKEN) {
      return res.status(403).json({ success: false, message: "forbidden" });
    }
    const url = req.query.url;
    if (!url || !url.startsWith("https://res.cloudinary.com/rgwnsnby/")) {
      return res.status(400).json({ success: false, message: "url must be an rgwnsnby Cloudinary URL" });
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
      // target the home doc whose hero already holds a single header (video/youtube)
      if (Array.isArray(bg) && bg.length >= 1 && bg.some((u) => typeof u === "string" && (u.includes("youtube") || u.includes("/video/upload/")))) {
        details.push({ _id: String(doc._id), from: bg, to: [url] });
        changed++;
        if (!dry) {
          const { _id, ...rest } = doc;
          rest.hero = { ...rest.hero, bgImage: [url] };
          await homeModel.replaceOne({ _id }, rest);
        }
      }
    }
    return res.status(200).json({ success: true, version: "sethome-v1", dry, docsScanned: docs.length, changed, details });
  } catch (error) {
    console.error("setHome error:", error);
    return res.status(500).json({ success: false, message: String(error?.message || error) });
  }
};

export default { setHome };
