import mongoose from "mongoose";

// One film on FILM6 TV.
//
// `provider` decides where the video actually plays from. Both are supported on
// purpose: YouTube so a page can be filled and shown today, Bunny Stream once
// the library exists. Switching one film over is a change of two fields, not a
// rebuild, and the two can coexist while a catalogue is migrated.
//
// Everything a visitor sees lives here rather than in the page, so the whole
// catalogue is editable from the admin panel without a deploy.
const FilmSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    // Used in the URL. Derived from the title when absent - see the controller.
    slug: { type: String, index: true },
    synopsis: { type: String, default: "" },
    director: { type: String, default: "" },
    year: { type: String, default: "" },
    // Free text ("12 min") rather than a number: festival runtimes get written
    // in whatever form the film-maker supplied and nothing here does maths on it.
    duration: { type: String, default: "" },

    // The row this film appears in on the page. Free text so new rows can be
    // invented from the panel without touching code.
    category: { type: String, default: "Films" },
    order: { type: Number, default: 0 },

    poster: { type: String, default: "" },
    alt: { type: String, default: "" },

    provider: { type: String, enum: ["youtube", "bunny"], default: "youtube" },
    // Stored as the embeddable form, exactly like the video sections already on
    // the site.
    youtubeUrl: { type: String, default: "" },
    // Bunny's per-video GUID. The library id lives once in the FILM6 TV
    // settings rather than being repeated on every film.
    bunnyVideoId: { type: String, default: "" },

    featured: { type: Boolean, default: false },
    // Unpublished films stay in the panel and off the website, so a catalogue
    // can be prepared before a festival rather than appearing as it is typed.
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const filmSchema = mongoose.models.film || mongoose.model("film", FilmSchema);
export default filmSchema;
