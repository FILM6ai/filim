import { uploadToCloudinary } from './cloudinaryUpload';
import { shrinkImage } from './shrinkImage';

// Pictures put INSIDE an article (pasted, dragged, or the editor's image
// button) arrive in the text as base64 - the whole photo written out as
// characters, a third bigger than the file. The article was then sent to the
// backend in one request, and Vercel refuses anything over ~4.5 MB, so one
// phone photo in the middle of an article was enough for "Failed to update".
//
// Before saving, each such picture is shrunk and uploaded straight to
// Cloudinary from the browser (no size ceiling there), and the text keeps
// only its short web address. The backend's own base64 handling stays as a
// fallback; it simply finds nothing left to do.
export const hostInlineImages = async (html) => {
  if (!html || !html.includes('data:image')) return html;

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const images = [...doc.querySelectorAll('img[src^="data:image"]')];

  for (const [i, img] of images.entries()) {
    const blob = await (await fetch(img.getAttribute('src'))).blob();
    const ext = (blob.type.split('/')[1] || 'png').replace('jpeg', 'jpg');
    const file = await shrinkImage(new File([blob], `article-image-${i + 1}.${ext}`, { type: blob.type }));
    img.setAttribute('src', await uploadToCloudinary(file));
  }

  return doc.body.innerHTML;
};

export default hostInlineImages;
