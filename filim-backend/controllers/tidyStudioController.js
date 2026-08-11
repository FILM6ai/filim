// TEMPORARY one-off cleanup. The studio sections whose images were lost kept the
// stand-in tile at bgImage[0] after the client uploaded the real image (the admin
// appends). The page renders the LAST entry, so the tile is invisible but still
// sitting there - this collapses each of those arrays to the single real image.
// Targeted $set on bgImage only, dry-run by default. REMOVE AFTER RUNNING.
import mongoose from "mongoose";

const TOKEN = "ts_studio_5Wq8Nm3Xr7Lp2Kv";
const STUDIO_ID = "685261ad08ed3ebd0e2e4978";

const TARGETS = {
  "toplist.bgImage":
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/studio_b0gsj9irw7qubnxrcmfc.jpg",
  "competate2.bgImage":
    "https://res.cloudinary.com/rgwnsnby/image/upload/v1786444934/udvsxylbig38wjy97m9q.png",
  "toplist3.bgImage":
    "https://res.cloudinary.com/rgwnsnby/image/upload/v1786444754/j0vsnym31eqgrhjift8p.png",
  "competate3.bgImage":
    "https://res.cloudinary.com/rgwnsnby/image/upload/v1786444726/rotn4m5a7hnplhojs5p3.png",
};

export const tidyStudio = async (req, res) => {
  try {
    if (req.query.token !== TOKEN) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    const apply = req.query.apply === "1";
    const db = mongoose.connection.db;
    const _id = new mongoose.Types.ObjectId(STUDIO_ID);

    const before = await db.collection("studios").findOne({ _id });
    if (!before) {
      return res.status(404).json({ success: false, message: "Studio doc not found" });
    }

    const plan = Object.entries(TARGETS).map(([path, url]) => {
      const section = path.split(".")[0];
      return {
        path,
        current: before[section]?.bgImage,
        next: [url],
      };
    });

    const $set = {};
    for (const [path, url] of Object.entries(TARGETS)) $set[path] = [url];

    if (apply) {
      await db.collection("studios").updateOne({ _id }, { $set });
    }

    return res.status(200).json({
      success: true,
      mode: apply ? "APPLIED" : "DRY RUN (add &apply=1 to write)",
      plan,
    });
  } catch (error) {
    console.error("tidyStudio error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
