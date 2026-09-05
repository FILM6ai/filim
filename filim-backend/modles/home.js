import mongoose from "mongoose";
import { videoSectionFields } from "./videoSection.js";

const HomePageSchema = new mongoose.Schema({
  hero: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    description: { type: String },
    button: { type: String },
    link: { type: String },
  },

  advance: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    title2: { type: String },
    description: { type: String },
  },
  toplist: {
    bgImage: [{ type: String }],
    alt: { type: String },
    title: { type: String },
    description: { type: String },
    button: { type: String },
    link: { type: String },
  },
  videos: {
    videoUrls: [{ type: String }],   // Line change: String → [String] array
    youtubeUrl: { type: String },
    title: { type: String },
    description: { type: String },
  },
  robot: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    description: { type: String },
    button: { type: String },
    link: { type: String },
  },
  competate: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    description: { type: String },
    button: { type: String },
    link: { type: String },
  },
  // Second video block, shown between the Celebrating Innovation section and
  // Cinematic Metaverse. Kept as its own field rather than turning `videos` into
  // an array, so nothing that already reads `videos` has to change.
  videos2: { ...videoSectionFields },
  runway: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    button: { type: String },
    link: { type: String },
  },
});

const homeSchema =
  mongoose.models.home || mongoose.model("home", HomePageSchema);
export default homeSchema;
