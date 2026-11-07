// The News and Contact headers take a picture or a video in the same slot.
//
// Saved headers only keep the Cloudinary address, so whether it is a video is
// read off the address: Cloudinary files videos under /video/upload/, and a
// pasted link usually ends in its extension.
export const isVideo = (media) => {
  if (!media) return false;
  if (typeof media !== 'string') return Boolean(media.type?.startsWith('video/'));
  return /\/video\/upload\//i.test(media) || /\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i.test(media);
};

export const mediaSrc = (media) =>
  typeof media === 'string' ? media : URL.createObjectURL(media);
