// TEMPORARY one-off: restore the Home hero to the correct 4K-derived video.
// Hardcoded target (no params that could set a wrong value). Token-gated, ?dry=1.
import mongoose from "mongoose";
import homeModel from "../modles/home.js";

const TOKEN = "f6_home_restore_Rt9Xm2Qw";
const HOME_URL =
  "https://res.cloudinary.com/rgwnsnby/video/upload/c_limit,w_1920,q_auto:best/site-headers/header_home_4k.mp4";

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
      // the home doc is the one holding a single hero entry (currently the broken /x)
      if (Array.isArray(bg) && bg.length >= 1 && !(bg.length === 1 && bg[0] === HOME_URL)) {
        // only touch the doc whose hero is a single short/broken entry or a header video/youtube
        const single = bg.length === 1 ? bg[0] : "";
        const looksLikeHero = typeof single === "string" && (single.includes("/video/upload/") || single.includes("youtube") || single === "https://res.cloudinary.com/rgwnsnby/x");
        if (looksLikeHero) {
          details.push({ _id: String(doc._id), from: bg, to: [HOME_URL] });
          changed++;
          if (!dry) {
            const { _id, ...rest } = doc;
            rest.hero = { ...rest.hero, bgImage: [HOME_URL] };
            await homeModel.replaceOne({ _id }, rest);
          }
        }
      }
    }
    return res.status(200).json({ success: true, version: "restore-v1", dry, docsScanned: docs.length, changed, details });
  } catch (error) {
    console.error("fixHome error:", error);
    return res.status(500).json({ success: false, message: String(error?.message || error) });
  }
};

export default { fixHome };
