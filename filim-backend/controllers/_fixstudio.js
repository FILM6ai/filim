// TEMPORARY surgical fix: restore studio hero.bgImage (got emptied in DB).
// Safe-by-default: dry unless apply=1; hardcoded target (no free url param);
// token-gated; touches ONLY hero.bgImage. Remove after use.
import studioSchema from "../modles/studio.js";

const TOKEN = "fx_9Qs2Lp7Vr4Tz8Kd";
const TARGET_URL =
  "https://res.cloudinary.com/rgwnsnby/video/upload/c_limit,w_1920,q_auto/site-headers/header_studio.mp4";

export const fixStudioHero = async (req, res) => {
  try {
    if (req.query.token !== TOKEN) {
      return res.status(403).json({ success: false, message: "forbidden" });
    }
    const doc = await studioSchema.findOne({});
    if (!doc) return res.status(404).json({ success: false, message: "no studio doc" });

    const before = doc.hero?.bgImage || [];
    const apply = req.query.apply === "1";
    const wouldSet = [TARGET_URL];

    if (!apply) {
      return res.status(200).json({
        success: true,
        version: "fixstudio-v1",
        dry: true,
        _id: doc._id,
        before,
        wouldSet,
      });
    }

    await studioSchema.updateOne(
      { _id: doc._id },
      { $set: { "hero.bgImage": wouldSet } }
    );
    const after = await studioSchema.findById(doc._id).lean();
    return res.status(200).json({
      success: true,
      version: "fixstudio-v1",
      dry: false,
      _id: doc._id,
      before,
      after: after.hero?.bgImage || [],
    });
  } catch (e) {
    console.error("fixStudioHero error:", e);
    return res.status(500).json({ success: false, message: String(e) });
  }
};
