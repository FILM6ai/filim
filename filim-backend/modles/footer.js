
import mongoose from 'mongoose';

const FooterLinkSchema = new mongoose.Schema({
  name: { type: String },
  link: { type: String },
});

const FooterPartnerSchema = new mongoose.Schema({
  name: { type: String },
  link: { type: String },
  logo: { type: String },
});

const FooterSchema = new mongoose.Schema({
  logo: { type: String },
  links: {
    type: [FooterLinkSchema],
    default: [],
  },
  partners: {
    type: [FooterPartnerSchema],
    default: [],
  },
  tiktokIcon: { type: String },
  youtubeIcon: { type: String },
  instaIcon: { type: String },
  twitterIcon: { type: String },
  description: { type: String },
});

const Footer = mongoose.models.Footer || mongoose.model('Footer', FooterSchema);
export default Footer;
