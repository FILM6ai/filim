// Shrinks a photo in the browser before it is sent with an article.
//
// Articles post their cover picture THROUGH the backend, and Vercel refuses
// any request over about 4.5 MB before the backend even sees it - so a phone
// photo (often 5-10 MB) failed with a generic "Failed" while the panel still
// promised "Max 10MB". Resized to 2000px on the long side as a JPEG, a cover
// is typically well under 1 MB and looks the same on the site.
//
// Anything small enough already, a GIF, or a file the browser cannot decode is
// returned untouched.
export const shrinkImage = async (
  file,
  { maxSide = 2000, quality = 0.85, threshold = 1.5 * 1024 * 1024 } = {},
) => {
  if (!file || !file.type?.startsWith('image/') || file.type === 'image/gif') return file;
  if (file.size <= threshold) return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  // JPEG has no transparency: paint white first so a transparent PNG does not
  // come out with a black background.
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, { type: 'image/jpeg' });
};

// The reason a save failed, in words Francois can act on.
export const uploadErrorMessage = (error, fallback) => {
  if (error?.response?.status === 413) {
    return 'Too big to send. Use a smaller cover picture, or fewer pictures inside the text.';
  }
  if (error?.response?.status === 401) return 'Your session has expired - sign in again';
  return error?.response?.data?.message || fallback;
};

export default shrinkImage;
