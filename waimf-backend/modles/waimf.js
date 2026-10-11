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
        },
      ],
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
    advance: { ...blockFields },
    videos: { ...videoSectionFields },
    videos2: { ...videoSectionFields },
  },
  { timestamps: true },
);

const waimfSchema =
  mongoose.models.waimf || mongoose.model("waimf", WaimfPageSchema);
export default waimfSchema;
