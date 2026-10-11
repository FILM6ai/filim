// The video block that already existed only on the home page. The studio,
// production, festival and news pages now carry the same shape, so one player
// component on the site and one editor in the panel serve all five pages.
//
// Spread it into a schema as `videos: { ...videoSectionFields }` - defining the
// fields once keeps the pages from drifting apart the next time one is edited.
export const videoSectionFields = {
  videoUrls: [{ type: String }],
  youtubeUrl: { type: String },
  title: { type: String },
  description: { type: String },
};

export default videoSectionFields;
