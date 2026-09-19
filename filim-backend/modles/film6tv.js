import mongoose from "mongoose";

// The page furniture for FILM6 TV - everything that is not a film.
//
// A single document. Kept apart from the films so that editing a headline can
// never touch the catalogue, and so the page has something to render before any
// film exists.
const Film6TvSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: "FILM6 TV" },
      description: { type: String, default: "" },
      // Optional background. A film can be featured instead - see `featured`
      // on the film model.
      bgImage: { type: String, default: "" },
      alt: { type: String, default: "" },
    },

    // The block aimed at film-makers: the reason this page exists before the
    // festival.
    cta: {
      title: { type: String, default: "Get your film on FILM6 TV" },
      description: { type: String, default: "" },
      buttonText: { type: String, default: "Submit your film" },
      buttonLink: { type: String, default: "/contact" },
    },

    // Deliberately empty and deliberately his. Anything a film-maker is asked
    // to agree to has to be written by FILM6, not invented here, so this is a
    // slot rather than a default. The page hides the block when it is blank.
    legalText: { type: String, default: "" },

    // Bunny Stream video library id. Stored once, not per film. The API key is
    // NOT here - it is a secret and belongs in the backend environment.
    bunnyLibraryId: { type: String, default: "" },

    // The order the rows appear in on the page. A category not listed here
    // still renders, after these.
    rowOrder: [{ type: String }],
  },
  { timestamps: true },
);

const film6tvSchema =
  mongoose.models.film6tv || mongoose.model("film6tv", Film6TvSchema);
export default film6tvSchema;
