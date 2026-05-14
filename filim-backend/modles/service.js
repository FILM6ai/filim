import mongoose from "mongoose";

const ServicePageSchema = new mongoose.Schema({
  hero: {
    bgImage: { type: String },
    title: { type: String },
    alt: { type: String },
    description: { type: String },
  },
  advance: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    title2: { type: String },
    description: { type: String },
  },
  toplist: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    description: { type: String },
    button: { type: String },
    link: { type: String },
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
  runway: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    button: { type: String },
    link: { type: String },
  },
});

const serviceSchema =
  mongoose.models.service || mongoose.model("service", ServicePageSchema);
export default serviceSchema;
