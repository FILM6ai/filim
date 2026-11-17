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

// Header videos, as Cloudinary can serve them to every browser.
//
// Francois uploads straight from his Mac: 4K HEVC .mov files of 13-40MB.
// Safari plays those, but Firefox and many Chrome/Windows setups cannot play
// HEVC at all, and 40MB is a lot for a header. Cloudinary re-encodes on
// request to 1080p H.264 (about 5 Mbps at q_auto:best, a few MB per clip).
// The original stays as a second <source>, so if the converted copy ever
// fails to load the browser falls back to the file as uploaded.
const CLOUDINARY_VIDEO = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/)(.*?)(\.[a-z0-9]+)?$/i;

export const webVideo = (url) => {
  const src = String(url || '');
  const match = src.match(CLOUDINARY_VIDEO);
  if (!match) return src;
  // Carries its own options already - leave it alone.
  if (/^[a-z]{1,3}_[^/]*\//.test(match[2])) return src;
  // An .mp4 is left as uploaded: the 1080p H.264 headers made for him already
  // play everywhere, and re-encoding them only costs quality (4.5 -> 3 Mbps).
  if (/^\.mp4$/i.test(match[3] || '')) return src;
  return `${match[1]}vc_h264,c_limit,w_1920,q_auto:best/${match[2]}.mp4`;
};

// The <source> list for a header <video>: the web copy first, the original
// as the fallback. Same file twice is skipped.
export const videoSources = (url) => {
  const original = String(url || '');
  const web = webVideo(original);
  return web && web !== original ? [web, original] : [original];
};
