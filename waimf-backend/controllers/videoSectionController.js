// Read/write the `videos` block of any page that has one.
//
// These deliberately do NOT reuse the per-page update endpoints. updateStudioPage,
// updateServicePage and updateFestivalPage rebuild every section of the document
// from the request body, so a PUT carrying only the video block would write
// `undefined` over every other title, description and link on that page. Writing
// through dotted `videos.*` paths touches four fields and nothing else, whatever
// else the document happens to hold.
//
// Each handler is a factory taking the mongoose model, so studio, service,
// festival and news share one implementation and cannot drift apart.
//
// The second argument names the field to read and write. It defaults to `videos`,
// which is what every page had when this was written; the home page has a second
// block stored as `videos2`. The response always comes back under the key
// `videos` whichever field it came from - which field a page uses is storage
// detail, and the panel component should not have to know it.

const EMPTY_SECTION = {
  title: "",
  description: "",
  youtubeUrl: "",
  videoUrls: [],
};

// The panel sends JSON, but the page forms send multipart where every value
// arrives as a string. Accept both rather than depending on which one called.
const parseVideos = (body) => {
  const raw = body?.videos ?? body;
  if (!raw) return {};
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
};

export const getVideoSection = (model, field = "videos") => async (req, res) => {
  try {
    const doc = await model.findOne({});
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    const stored = doc[field];
    return res.status(200).json({
      success: true,
      id: doc._id,
      videos: { ...EMPTY_SECTION, ...(stored?.toObject?.() || stored || {}) },
    });
  } catch (error) {
    console.error("Error fetching video section:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch video section" });
  }
};

export const updateVideoSection = (model, field = "videos") => async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await model.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    const payload = parseVideos(req.body);
    const current = existing[field] || {};

    // Uploads reach Cloudinary from the browser with a signed request, so the
    // panel sends back finished URLs. Merging rather than replacing means a save
    // that adds one video does not drop the ones already there.
    const merged = [
      ...asArray(current.videoUrls),
      ...asArray(payload.videoUrls),
    ];

    const set = {
      [`${field}.videoUrls`]: Array.from(new Set(merged.filter(Boolean))),
      [`${field}.title`]: payload.title ?? current.title ?? "",
      [`${field}.description`]: payload.description ?? current.description ?? "",
      // An absent key keeps what is stored; an empty string clears it on
      // purpose, which is how the panel removes a video from a page.
      [`${field}.youtubeUrl`]:
        payload.youtubeUrl === undefined
          ? current.youtubeUrl ?? ""
          : String(payload.youtubeUrl).trim(),
    };

    const updated = await model.findByIdAndUpdate(
      id,
      { $set: set },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      videos: updated[field],
      message: "Video section updated successfully",
    });
  } catch (error) {
    console.error("Error updating video section:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update video section" });
  }
};

export const deleteVideoSectionItem = (model, field = "videos") => async (req, res) => {
  try {
    const { id } = req.params;
    // The body's `field` says which part of the block to clear (the YouTube link
    // or one uploaded file); the factory's `field` says which block. Different
    // things, so the body's is read out under a different name here.
    const { field: target, videoUrl } = req.body || {};

    const existing = await model.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    let updateQuery;
    if (target === "videoUrls") {
      updateQuery = {
        [`${field}.videoUrls`]: asArray(existing[field]?.videoUrls).filter(
          (url) => url !== videoUrl,
        ),
      };
    } else if (target === "youtubeUrl") {
      updateQuery = { [`${field}.youtubeUrl`]: "" };
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Unknown field" });
    }

    const updated = await model.findByIdAndUpdate(
      id,
      { $set: updateQuery },
      { new: true },
    );

    return res.status(200).json({ success: true, videos: updated[field] });
  } catch (error) {
    console.error("Error deleting from video section:", error);
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};
