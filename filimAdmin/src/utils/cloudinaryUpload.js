import { BACKEND_URL } from "@/utils/backend";

// Upload straight from the browser to Cloudinary with a signature the backend
// issues. Going through the backend instead would put the file through multer,
// which caps uploads at 20MB - too small for a video of any length.
export const uploadToCloudinary = async (file) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("Cloudinary cloud name is not configured");

  const signRes = await fetch(`${BACKEND_URL}/api/cloudinary/sign`, {
    method: "POST",
  });
  const signJson = await signRes.json();
  if (!signRes.ok || !signJson.success) {
    throw new Error(signJson.message || "Failed to get upload signature");
  }

  const { signature, timestamp, apiKey } = signJson;

  const data = new FormData();
  data.append("file", file);
  data.append("api_key", apiKey);
  data.append("timestamp", timestamp);
  data.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: data },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "Upload failed");
  return json.secure_url || json.url;
};

export default uploadToCloudinary;
