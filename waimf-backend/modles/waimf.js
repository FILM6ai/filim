import mongoose from "mongoose";
import { videoSectionFields } from "./videoSection.js";

// waimf.org - the festival's own site.
//
// A SEPARATE record from the FILM6 festival page, not a second reader of it.
// The two say similar things today because this was seeded from that page, but
// they are different sites with different audiences and they will drift apart
// on purpose. Sharing one record would mean an edit meant for one silently
// rewrote the other.
//
// What IS shared is the backend and the admin panel: one API, one login, one
// place to fix a bug. Only the content is separate.
//
// The section names deliberately match the FILM6 festival schema so the admin
// screens and the page components could be reused rather than rewritten.

const popupFields = {
  title: { type: String },
  content: { type: String },
  heading: { type: String },
  description: { type: String },
  subtitle: { type: String },
  tagline: { type: String },
  buttonText: { type: String },
  buttonLink: { type: String },
  image: { type: String },
  youtubeUrl: { type: String },
};

const blockFields = {
  alt: { type: String },
  bgImage: [{ type: String }],
  title: { type: String },
  description: { type: String },
  button: { type: String },
  link: { type: String },
  popup: { ...popupFields },
};

const WaimfPageSchema = new mongoose.Schema(
  {
    // --- home / Edition 2026 ------------------------------------------------
    hero: {
      bgImage: { type: String },
      title: { type: String },
      alt: { type: String },
      description: { type: String },
      button: { type: String },
      link: { type: String },
      // The second, outlined button. Its text and address used to be fixed.
      button2: { type: String },
      link2: { type: String },
      // How dark the background picture is, 0-80. Empty = the site default.
      darkness: { type: Number, min: 0, max: 80 },
      // Which part of the picture stays in view when the screen crops it:
      // 0 = top edge, 100 = bottom edge. Empty = the site default.
      focus: { type: Number, min: 0, max: 100 },
      // The dates print in exactly ONE place on the site. Francois asked for
      // the repetition to go, so this is the single source for them.
      dateline: { type: String },
      popup: { ...popupFields },
    },

    // The festival in prose, plus the running order of the two days.
    edition: {
      title: { type: String },
      description: { type: String },
      schedule: [
        {
          when: { type: String },
          what: { type: String },
        },
      ],
    },

    // --- Top Filmmakers -----------------------------------------------------
    // The award winners. `award` is the category, so the list can be reordered
    // or extended without touching the page.
    filmmakers: {
      mainTitle: { type: String },
      description: { type: String },
      items: [
        {
          award: { type: String },
          film: { type: String },
          filmmaker: { type: String },
          link: { type: String },
          image: { type: String },
          // The winning film itself. Francois: "top filmmakers is more for
          // AWARDS WINNERS, and OFFICIAL selection page for Finalists and
          // official selection... to balance more the volume of videos".
          // So the winners' films play HERE, and do not also appear on the
          // selection page - one film, one home.
          youtubeUrl: { type: String, default: "" },
          poster: { type: String, default: "" },
          duration: { type: String, default: "" },
        },
      ],
    },

    // --- Official Selection -------------------------------------------------
    selection: {
      mainTitle: { type: String },
      description: { type: String },
      items: [
        {
          title: { type: String },
          director: { type: String },
          duration: { type: String },
          youtubeUrl: { type: String },
          poster: { type: String },
          alt: { type: String },
          // Which group this film belongs to on the selection page -
          // "Finalist" or, left empty, the wider Official Selection.
          // Finalists sort first and print their own laurel. The award
          // WINNERS are not here at all; they live on Top Filmmakers.
          category: { type: String, default: "" },
        },
      ],
      // Two optional video blocks on the Official Selection page: one just
      // above the Official Selection list, one below it. One YouTube address
      // per entry; empty = the block is not shown.
      videosAbove: {
        title: { type: String, default: "" },
        urls: [{ type: String }],
      },
      videosBelow: {
        title: { type: String, default: "" },
        urls: [{ type: String }],
      },
    },

    // --- Awards, jury, gallery ---------------------------------------------
    awards: {
      mainTitle: { type: String },
      description: { type: String },
      cards: [
        {
          title: { type: String },
          description: { type: String },
          image: { type: String },
        },
      ],
    },
    jurors: {
      mainTitle: { type: String },
      items: [
        {
          name: { type: String },
          role: { type: String },
          image: { type: String },
          articleId: { type: String, default: "" },
          link: { type: String, default: "" },
        },
      ],
    },
    gallery: {
      mainTitle: { type: String },
      images: [{ type: String }],
    },

    // --- Rules --------------------------------------------------------------
    rules: {
      mainTitle: { type: String },
      subtitle: { type: String },
      items: [
        {
          term: { type: String },
          definition: { type: String },
        },
      ],
    },

    // --- Contact ------------------------------------------------------------
    contact: {
      mainTitle: { type: String },
      description: { type: String },
      buttonText: { type: String },
    },

    // Spare blocks matching the FILM6 festival page, so a section from there
    // can be dropped in without a schema change.
    // --- Search engines and analytics --------------------------------------
    // Page titles/descriptions for Google and link previews, the Google
    // Analytics measurement ID (G-...) and the Search Console verification
    // code. All three are public by nature: they end up in the page HTML.
    seo: {
      gaId: { type: String, default: "" },
      googleVerification: { type: String, default: "" },
      pages: {
        home: { title: String, description: String },
        filmmakers: { title: String, description: String },
        selection: { title: String, description: String },
        gallery: { title: String, description: String },
        rules: { title: String, description: String },
        news: { title: String, description: String },
        contact: { title: String, description: String },
        terms: { title: String, description: String },
      },
    },

    advance: { ...blockFields },
    videos: { ...videoSectionFields },
    videos2: { ...videoSectionFields },
  },
  { timestamps: true },
);

const waimfSchema =
  mongoose.models.waimf || mongoose.model("waimf", WaimfPageSchema);
export default waimfSchema;
