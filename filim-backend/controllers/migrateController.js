// TEMPORARY one-off migration: re-point broken header videos + festival gallery
// from the disabled Cloudinary cloud (drh7q62eh) to the active account (rgwnsnby).
// Token-gated, exact-value replacement only, supports ?dry=1. Safe to delete after use.
import mongoose from "mongoose";
import studioModel from "../modles/studio.js";
import serviceModel from "../modles/service.js";
import festivalModel from "../modles/festival.js";
import contactModel from "../modles/contact.js";
import faqModel from "../modles/faq.js";

const TOKEN = "f6_media_2f9K7wQx8Lp";

// Exact old URL -> new optimized URL (header videos)
const URL_MAP = {
  "https://res.cloudinary.com/drh7q62eh/video/upload/v1783775111/odcnwuz57318ouzivue2.mp4":
    "https://res.cloudinary.com/rgwnsnby/video/upload/c_limit,w_1920,q_auto/site-headers/header_studio.mp4",
  "https://res.cloudinary.com/drh7q62eh/video/upload/v1782996070/zppbjicq4jgk4pxxhzta.mov":
    "https://res.cloudinary.com/rgwnsnby/video/upload/c_limit,w_1920,q_auto/site-headers/header_services.mp4",
  "https://res.cloudinary.com/drh7q62eh/video/upload/v1783886100/ng1dc3vlruvfta4zktsg.mp4":
    "https://res.cloudinary.com/rgwnsnby/video/upload/c_limit,w_1920,q_auto/site-headers/header_festival.mp4",
  "https://res.cloudinary.com/drh7q62eh/video/upload/v1784804832/hnhvcrz9sj0y2e8iobr4.mp4":
    "https://res.cloudinary.com/rgwnsnby/video/upload/c_limit,w_1920,q_auto/site-headers/header_contact.mp4",
  "https://res.cloudinary.com/drh7q62eh/video/upload/v1780407005/wl5mwgjakkjtjit0mwbq.mp4":
    "https://res.cloudinary.com/rgwnsnby/video/upload/c_limit,w_1920,q_auto/site-headers/header_faq.mp4",
};

const GALLERY_IMAGES = [
  "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto,w_1200/site-headers/festival_gallery_1.png",
  "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto,w_1200/site-headers/festival_gallery_2.png",
  "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto,w_1200/site-headers/festival_gallery_3.png",
  "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto,w_1200/site-headers/festival_gallery_4.png",
  "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto,w_1200/site-headers/festival_gallery_5.png",
];

// deep-replace exact string matches; returns [newValue, count]
function deepReplace(value, map) {
  let count = 0;
  const walk = (v) => {
    if (typeof v === "string") {
      if (Object.prototype.hasOwnProperty.call(map, v)) {
        count++;
        return map[v];
      }
      return v;
    }
    if (Array.isArray(v)) return v.map(walk);
    // Only recurse into PLAIN objects; leave ObjectId, Date, Buffer, etc. untouched
    if (v && typeof v === "object" && v.constructor === Object) {
      const out = {};
      for (const k of Object.keys(v)) out[k] = walk(v[k]);
      return out;
    }
    return v;
  };
  const replaced = walk(value);
  return [replaced, count];
}

export const fixMedia = async (req, res) => {
  try {
    if (req.query.token !== TOKEN) {
      return res.status(403).json({ success: false, message: "forbidden" });
    }
    const dry = req.query.dry === "1" || req.query.dry === "true";

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const models = {
      studio: studioModel,
      service: serviceModel,
      festival: festivalModel,
      contact: contactModel,
      faq: faqModel,
    };

    const report = { dry, collections: {} };

    for (const [name, Model] of Object.entries(models)) {
      const coll = Model.collection;
      const docs = await coll.find({}).toArray();
      let urlReplacements = 0;
      let docsChanged = 0;
      let gallerySet = false;

      for (const doc of docs) {
        const before = JSON.stringify(doc);
        let [newDoc, cnt] = deepReplace(doc, URL_MAP);
        urlReplacements += cnt;

        // Festival: also set the visible gallery to the 5 new images
        if (name === "festival" && newDoc.gallery && Array.isArray(newDoc.gallery.images)) {
          const oldImgs = newDoc.gallery.images || [];
          const hasBroken = oldImgs.some((u) => typeof u === "string" && u.includes("drh7q62eh"));
          if (hasBroken || oldImgs.length !== GALLERY_IMAGES.length) {
            newDoc.gallery.images = [...GALLERY_IMAGES];
            gallerySet = true;
          }
        }

        const changed = cnt > 0 || gallerySet;
        if (changed && JSON.stringify(newDoc) !== before) {
          docsChanged++;
          if (!dry) {
            await coll.replaceOne({ _id: doc._id }, newDoc);
          }
        }
      }

      report.collections[name] = {
        docsScanned: docs.length,
        urlReplacements,
        docsChanged,
        gallerySet,
      };
    }

    return res.status(200).json({ success: true, ...report });
  } catch (error) {
    console.error("fixMedia error:", error);
    return res.status(500).json({ success: false, message: String(error?.message || error) });
  }
};

export default { fixMedia };
