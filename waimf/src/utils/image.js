// Asking Cloudinary for a sensible size instead of the original.
//
// The jury photographs are stored as raw PNGs of 1-2.7MB each. Eight of them on
// one page is roughly 12MB of images for a grid that never shows them larger
// than about 320px wide. Cloudinary will resize and re-encode on demand, so
// this costs nothing to use and nothing to maintain.
//
// Anything not on Cloudinary is returned untouched rather than guessed at - a
// poster pasted in from YouTube or anywhere else must keep working.
const CLOUDINARY = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;

export const cdn = (url, transform = 'f_auto,q_auto,w_800') => {
  const match = String(url || '').match(CLOUDINARY);
  if (!match) return url || '';
  // Already transformed (someone pasted a URL that carries its own options) -
  // leave it alone rather than stacking a second set on top.
  if (/^[a-z]_[^/]*\//.test(match[2])) return url;
  return `${match[1]}${transform}/${match[2]}`;
};

// Square portraits in a four-across grid.
export const portrait = (url) => cdn(url, 'f_auto,q_auto,c_fill,g_face,w_600,h_600');

// Gallery tiles, 4:3.
export const tile = (url) => cdn(url, 'f_auto,q_auto,c_fill,w_800,h_600');

export default cdn;
