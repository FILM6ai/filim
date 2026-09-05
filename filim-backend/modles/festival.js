import mongoose from "mongoose";
import { videoSectionFields } from "./videoSection.js";

const FestivalPageSchema = new mongoose.Schema({
  videos: { ...videoSectionFields },
  // Second video block, lower down the page. Its own field rather than an
  // array, so nothing that already reads `videos` has to change.
  videos2: { ...videoSectionFields },

  hero: {
    bgImage: { type: String },
    title: { type: String },
    alt: { type: String },
    description: { type: String },
     button: { type: String },
  link: { type: String },
    popup: {
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
    },
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
    popup: {
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
    },
  },
  robot: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    description: { type: String },
    button: { type: String },
    link: { type: String },
    popup: {
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
    },
  },
  competate: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    description: { type: String },
    button: { type: String },
    link: { type: String },
    popup: {
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
    },
  },
  cardSection: {
    mainTitle: { type: String }, // Only one main title
    cards: [
      {
        title: { type: String },
        description: { type: String },
        image: { type: String },
      },
    ],
  },
  runway: {
    alt: { type: String },
    bgImage: [{ type: String }],
    title: { type: String },
    button: { type: String },
    link: { type: String },
    popup: {
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
    },
  },
  glossary: {
    mainTitle: { type: String },
    subtitle: { type: String },
    items: [
      {
        term: { type: String },
        definition: { type: String },
      },
    ],
  },

  gallery: {
    mainTitle: { type: String },
    images: [{ type: String }],
  },
  jurors: {
    mainTitle: { type: String },
    items: [
      {
        name: { type: String },
        role: { type: String },
        image: { type: String },
        // Which News article this juror's photo opens.
        //
        // articleId is the one that matters: article addresses are built from
        // the title, so an article that gets retitled moves to a new address
        // and any address stored here would quietly stop working. Holding the
        // id instead means the link is worked out from the article's current
        // title every time the page is drawn.
        //
        // link is the fallback, for a juror whose profile lives somewhere off
        // this site. It is only used when there is no articleId.
        articleId: { type: String, default: '' },
        link: { type: String, default: '' },
      },
    ],
  },
});

const festivalSchema =
  mongoose.models.festival || mongoose.model("festival", FestivalPageSchema);
export default festivalSchema;
