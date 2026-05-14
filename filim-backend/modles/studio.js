import mongoose from "mongoose";

const StudioPageSchema = new mongoose.Schema({
  hero: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    description: { type: String },
  },

  advance: {
    title: { type: String },
    title2: { type: String },
    description: { type: String },
  },
  card1: {
    mainTitle: { type: String },
    description: { type: String },
    catogryImage: { type: String },
    youtubeUrl: { type: String },
  },
  card2: {
    description: { type: String },
    catogryImage: { type: String },
    youtubeUrl: { type: String },
  },
  card3: {
    description: { type: String },
    catogryImage: { type: String },
    youtubeUrl: { type: String },
  },
  card4: {
    description: { type: String },
    catogryImage: { type: String },
    youtubeUrl: { type: String },
  },
  card5: {
    description: { type: String },
    catogryImage: { type: String },
    youtubeUrl: { type: String },
  },
  card6: {
    description: { type: String },
    catogryImage: { type: String },
    youtubeUrl: { type: String },
  },
  toplist: {
    alt: { type: String },
     bgImage: [{ type: String }],
    title: { type: String },
    genre: { type: String },
    line: { type: String },
    description: { type: String },
    description2: { type: String },
    button: { type: String },
    link: { type: String },
    youtubeUrl: { type: String },
  },

  competate: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    genre: { type: String },
    description: { type: String },
    description2: { type: String },
    button: { type: String },
    link: { type: String },
    youtubeUrl: { type: String },
  },
  toplist2: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    genre: { type: String },
    line: { type: String },
    description: { type: String },
    description2: { type: String },
    button: { type: String },
    link: { type: String },
    youtubeUrl: { type: String },
  },
  competate2: {
    alt: { type: String },
     bgImage: [{ type: String }],
    title: { type: String },
    genre: { type: String },
    description: { type: String },
    description2: { type: String },
    button: { type: String },
    link: { type: String },
    youtubeUrl: { type: String },
  },
  toplist3: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    genre: { type: String },
    line: { type: String },
    description: { type: String },
    description2: { type: String },
    button: { type: String },
    link: { type: String },
    youtubeUrl: { type: String },
  },
  competate3: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    genre: { type: String },
    description: { type: String },
    description2: { type: String },
    button: { type: String },
    link: { type: String },
    youtubeUrl: { type: String },
  },
});

const studioSchema =
  mongoose.models.studio || mongoose.model("studio", StudioPageSchema);
export default studioSchema;
