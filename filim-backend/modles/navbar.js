// import mongoose from 'mongoose';

// const NavbarLinkSchema = new mongoose.Schema({
//   name: { type: String, },
//   link: { type: String,  },
// });

// const NavbarSchema = new mongoose.Schema({
//   logo: { type: String },
//   links: {
//     type: [NavbarLinkSchema],
//     default: [],
//   },
//   tiktokIcon: { type: String },
//   youtubeIcon: { type: String },
//   instaIcon: { type: String },
//   twitterIcon: { type: String },
// });

// const Navbar = mongoose.models.Navbar || mongoose.model('Navbar', NavbarSchema);
// export default Navbar;








import mongoose from 'mongoose';

const NavbarLinkSchema = new mongoose.Schema({
  name: { type: String },
  link: { type: String },
});

const NavbarSchema = new mongoose.Schema({
  logo: { type: String },
  // The links array now holds the icon links (e.g., TikTok, YouTube, Instagram, Twitter)
  links: {
    type: [NavbarLinkSchema],
    default: [],
  },
  tiktokIcon: { type: String },
  youtubeIcon: { type: String },
  instaIcon: { type: String },
  twitterIcon: { type: String },
});

const Navbar = mongoose.models.Navbar || mongoose.model('Navbar', NavbarSchema);
export default Navbar;
