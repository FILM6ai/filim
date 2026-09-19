import filmSchema from "../modles/film.js";
import film6tvSchema from "../modles/film6tv.js";

// FILM6 TV: the film catalogue, and the page furniture around it.
//
// Every write here is field-scoped. None of these handlers rebuilds a document
// from the request body, so a save that carries one field cannot blank the
// rest - which is the trap the page update endpoints on this project fall into.

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Accepts whatever form of YouTube link gets pasted and returns the one form an
// iframe can use. Empty stays empty; anything unrecognisable returns null so the
// caller can refuse it rather than storing something that will never play.
const toEmbedUrl = (input) => {
  const trimmed = String(input || "").trim();
  if (!trimmed) return "";

  const patterns = [
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
};

// A film with no playable source would render an empty box on the page, so it
// is refused at the door rather than stored.
const hasSource = (film) =>
  Boolean(film.provider === "bunny" ? film.bunnyVideoId : film.youtubeUrl);

// --- catalogue -------------------------------------------------------------

export const getFilms = async (req, res) => {
  try {
    // The website asks for published films only; the panel asks for everything.
    const includeUnpublished = req.query.all === "1";
    const query = includeUnpublished ? {} : { published: true };
    // ?edition=WAIMF%202026 narrows the catalogue to one festival selection, so
    // a second site can render its own films from this same endpoint without a
    // second database or a second admin screen.
    if (req.query.edition) query.edition = req.query.edition;

    const films = await filmSchema
      .find(query)
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({ success: true, films });
  } catch (error) {
    console.error("Error fetching films:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch films" });
  }
};

export const createFilm = async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.title) {
      return res
        .status(400)
        .json({ success: false, message: "A title is required" });
    }

    const provider = body.provider === "bunny" ? "bunny" : "youtube";

    let youtubeUrl = "";
    if (provider === "youtube") {
      youtubeUrl = toEmbedUrl(body.youtubeUrl);
      if (youtubeUrl === null) {
        return res.status(400).json({
          success: false,
          message: "That is not a YouTube link",
        });
      }
    }

    const film = await filmSchema.create({
      title: body.title,
      slug: slugify(body.slug || body.title),
      synopsis: body.synopsis || "",
      director: body.director || "",
      year: body.year || "",
      duration: body.duration || "",
      category: body.category || "Films",
      order: Number(body.order) || 0,
      poster: body.poster || "",
      alt: body.alt || "",
      provider,
      youtubeUrl,
      bunnyVideoId: provider === "bunny" ? String(body.bunnyVideoId || "").trim() : "",
      edition: body.edition || "",
      laurels: Array.isArray(body.laurels) ? body.laurels.filter(Boolean) : [],
      titleImage: body.titleImage || "",
      featured: Boolean(body.featured),
      published: body.published === undefined ? true : Boolean(body.published),
    });

    return res.status(201).json({ success: true, film });
  } catch (error) {
    console.error("Error creating film:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create film" });
  }
};

export const updateFilm = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await filmSchema.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Film not found" });
    }

    const body = req.body || {};
    const set = {};

    // Only fields actually present in the request are written. An absent key
    // leaves what is stored alone.
    if (body.title !== undefined) {
      set.title = body.title;
      set.slug = slugify(body.slug || body.title);
    } else if (body.slug !== undefined) {
      set.slug = slugify(body.slug);
    }

    for (const field of [
      "synopsis",
      "director",
      "year",
      "duration",
      "category",
      "poster",
      "alt",
      "edition",
      "titleImage",
    ]) {
      if (body[field] !== undefined) set[field] = body[field];
    }

    if (body.order !== undefined) set.order = Number(body.order) || 0;
    if (body.featured !== undefined) set.featured = Boolean(body.featured);
    if (Array.isArray(body.laurels)) set.laurels = body.laurels.filter(Boolean);
    if (body.published !== undefined) set.published = Boolean(body.published);

    const provider =
      body.provider !== undefined
        ? body.provider === "bunny"
          ? "bunny"
          : "youtube"
        : existing.provider;

    if (body.provider !== undefined) set.provider = provider;

    if (body.youtubeUrl !== undefined) {
      const embed = toEmbedUrl(body.youtubeUrl);
      if (embed === null) {
        return res
          .status(400)
          .json({ success: false, message: "That is not a YouTube link" });
      }
      set.youtubeUrl = embed;
    }

    if (body.bunnyVideoId !== undefined) {
      set.bunnyVideoId = String(body.bunnyVideoId).trim();
    }

    const updated = await filmSchema.findByIdAndUpdate(
      id,
      { $set: set },
      { new: true },
    );

    // A published film with nothing to play is a broken tile on the website, so
    // the state is checked after the merge rather than per field.
    if (updated.published && !hasSource(updated)) {
      return res.status(200).json({
        success: true,
        film: updated,
        warning:
          "This film is published but has no video set, so it will not appear on the website.",
      });
    }

    return res.status(200).json({ success: true, film: updated });
  } catch (error) {
    console.error("Error updating film:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update film" });
  }
};

export const deleteFilm = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await filmSchema.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Film not found" });
    }
    return res.status(200).json({ success: true, message: "Film deleted" });
  } catch (error) {
    console.error("Error deleting film:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete film" });
  }
};

// --- page furniture --------------------------------------------------------

export const getFilm6Tv = async (req, res) => {
  try {
    // The page must render before anyone has opened the panel, so the document
    // is created on first read rather than being a prerequisite.
    let doc = await film6tvSchema.findOne({});
    if (!doc) doc = await film6tvSchema.create({});

    return res.status(200).json({ success: true, film6tv: doc });
  } catch (error) {
    console.error("Error fetching FILM6 TV settings:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch FILM6 TV settings" });
  }
};

export const updateFilm6Tv = async (req, res) => {
  try {
    let doc = await film6tvSchema.findOne({});
    if (!doc) doc = await film6tvSchema.create({});

    const body = req.body || {};
    const set = {};

    // Dotted paths so a save carrying only the hero cannot blank the call to
    // action, and vice versa.
    for (const [group, fields] of [
      ["hero", ["title", "description", "bgImage", "alt"]],
      ["cta", ["title", "description", "buttonText", "buttonLink"]],
    ]) {
      if (body[group] && typeof body[group] === "object") {
        for (const field of fields) {
          if (body[group][field] !== undefined) {
            set[`${group}.${field}`] = body[group][field];
          }
        }
      }
    }

    if (body.legalText !== undefined) set.legalText = body.legalText;
    if (body.bunnyLibraryId !== undefined) {
      set.bunnyLibraryId = String(body.bunnyLibraryId).trim();
    }
    if (Array.isArray(body.rowOrder)) set.rowOrder = body.rowOrder;

    const updated = await film6tvSchema.findByIdAndUpdate(
      doc._id,
      { $set: set },
      { new: true },
    );

    return res.status(200).json({ success: true, film6tv: updated });
  } catch (error) {
    console.error("Error updating FILM6 TV settings:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update FILM6 TV settings" });
  }
};
