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

    // Which festival and edition selected this film, e.g. "WAIMF 2026".
    // One field doing three jobs: it prints the laurel on the film, it groups a
    // year's selection into a row, and it is what waimf.org filters on so the
    // festival site can show its own selection from this same catalogue.
    edition: { type: String, default: "" },
    // Any other festival the film has been selected by. Borrowed credibility,
    // and the film-maker's to claim - so it is free text, not a fixed list.
    laurels: [{ type: String }],

    // Shown full width at the top of the page. More than one may be flagged;
    // the page rotates through them.
    featured: { type: Boolean, default: false },
    // The film's own title artwork, laid over the still. Optional - without one
    // the title is set in type, which is what most films will use.
    titleImage: { type: String, default: "" },
    // Unpublished films stay in the panel and off the website, so a catalogue
    // can be prepared before a festival rather than appearing as it is typed.
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const filmSchema = mongoose.models.film || mongoose.model("film", FilmSchema);
export default filmSchema;
