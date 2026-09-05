"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "@/utils/backend";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";

// The video block that already existed on the home page, now usable on Studio,
// Production, Festival and News.
//
// It saves on its own button rather than joining the page's big form, because
// each page's update endpoint rebuilds the whole document from whatever the form
// posts - saving the video through it would blank the rest of the page. It talks
// to /api/<resource>/videosection instead, which writes four fields and nothing
// else.
//
// `resource` is the API segment: "studio", "service" (the Production page),
// "festival", "news" or "home". `path` is the route on that resource, which is
// "videosection" everywhere except the home page's second block.
const VideoSection = ({ resource, pageName, path = "videosection", intro }) => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [savedYoutubeUrl, setSavedYoutubeUrl] = useState("");
  const [videoUrls, setVideoUrls] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const endpoint = `${BACKEND_URL}/api/${resource}/${path}`;
  // Two of these can sit on one admin page, so the file input needs an id that
  // is unique per block or clicking one label opens the other one's picker.
  const uploadId = `videoUpload-${resource}-${path}`;

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(endpoint);
        setId(data.id || "");
        setTitle(data.videos?.title || "");
        setDescription(data.videos?.description || "");
        setSavedYoutubeUrl(data.videos?.youtubeUrl || "");
        setYoutubeUrl(data.videos?.youtubeUrl || "");
        setVideoUrls(
          Array.isArray(data.videos?.videoUrls) ? data.videos.videoUrls : [],
        );
      } catch (error) {
        console.error("Failed to load video section:", error);
        toast.error("Could not load the video section");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [endpoint]);

  // Accepts whatever form of YouTube link gets pasted - the address bar, the
  // Share button, an embed URL, or just the 11-character id - and stores the one
  // form the website can put in an iframe.
  const toEmbedUrl = (input) => {
    const trimmed = (input || "").trim();
    if (!trimmed) return "";

    const patterns = [
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /[?&]v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match) return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  const handleSave = async () => {
    if (!id) {
      toast.error("This page has no record to save against yet");
      return;
    }

    // An empty box means "remove the video", which is allowed. Anything else has
    // to be a YouTube link we can actually embed, or the page would silently
    // show nothing after saving.
    const embedUrl = toEmbedUrl(youtubeUrl);
    if (embedUrl === null) {
      toast.error("That is not a YouTube link - paste the URL from the address bar");
      return;
    }

    setSaving(true);
    try {
      let uploaded = [];
      if (pendingFiles.length > 0) {
        uploaded = await Promise.all(
          pendingFiles.map((file) => uploadToCloudinary(file)),
        );
      }

      const { data } = await axios.put(`${endpoint}/${id}`, {
        videos: {
          title,
          description,
          youtubeUrl: embedUrl,
          videoUrls: uploaded,
        },
      });

      setSavedYoutubeUrl(data.videos?.youtubeUrl || "");
      setYoutubeUrl(data.videos?.youtubeUrl || "");
      setVideoUrls(
        Array.isArray(data.videos?.videoUrls) ? data.videos.videoUrls : [],
      );
      setPendingFiles([]);
      toast.success("Video section saved");
    } catch (error) {
      console.error("Failed to save video section:", error);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (field, videoUrl) => {
    if (!id) return;
    try {
      const { data } = await axios.delete(`${endpoint}/${id}`, {
        data: { field, videoUrl },
      });
      setSavedYoutubeUrl(data.videos?.youtubeUrl || "");
      if (field === "youtubeUrl") setYoutubeUrl("");
      setVideoUrls(
        Array.isArray(data.videos?.videoUrls) ? data.videos.videoUrls : [],
      );
      toast.success("Removed");
    } catch (error) {
      console.error("Failed to remove video:", error);
      toast.error("Delete failed");
    }
  };

  const hasVideo = Boolean(savedYoutubeUrl) || videoUrls.length > 0;

  return (
    <div className="p-4 border mt-10">
      {/* These four pages mount no toast container of their own, so without this
          every "Saved" and every error message here would fire into nothing and
          the Save button would look like it did nothing. */}
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-black pt-4 font-semibold text-lg">
        VIDEO PLAYER SECTION{pageName ? ` - ${pageName.toUpperCase()} PAGE` : ""}
      </h1>
      <p className="text-sm text-gray-600 mt-1">
        {intro ||
          "Paste a YouTube link to show a video on this page. Leave it empty and the section does not appear on the website at all."}
      </p>

      {loading ? (
        <p className="mt-4 text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="mt-6 border border-yellow-400 p-4">
            <h2 className="text-black font-semibold mb-2">YOUTUBE VIDEO URL</h2>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
              className="border border-black px-3 py-2 outline-0 w-full"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />

            {savedYoutubeUrl && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  CURRENTLY ON THE WEBSITE
                </h3>
                <div className="relative w-48">
                  <iframe
                    src={savedYoutubeUrl}
                    className="w-48 h-28"
                    allow="encrypted-media"
                    allowFullScreen
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete("youtubeUrl")}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-40 mt-6">
            <label
              htmlFor={uploadId}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <span className="text-gray-600 font-medium">
                Or upload a video
              </span>
              <span className="text-xs text-gray-600">
                Used only if no YouTube link is set
              </span>
            </label>
            <input
              id={uploadId}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) =>
                setPendingFiles((prev) => [...prev, ...Array.from(e.target.files)])
              }
            />
          </div>

          {pendingFiles.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-green-600 mb-2">
                NEW VIDEOS - press Save to upload
              </h2>
              <div className="flex gap-4 flex-wrap">
                {pendingFiles.map((file, i) => (
                  <div key={i} className="relative">
                    <video
                      controls
                      className="w-48 h-32 object-cover"
                      src={URL.createObjectURL(file)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPendingFiles((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {videoUrls.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-500 mb-2">
                UPLOADED VIDEOS
              </h2>
              <div className="flex gap-4 flex-wrap">
                {[...videoUrls].reverse().map((url) => (
                  <div key={url} className="relative">
                    <video controls className="w-48 h-28 object-cover" src={url} />
                    <button
                      type="button"
                      onClick={() => handleDelete("videoUrls", url)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 mt-6">
            <h1 className="text-black">TITLE (optional)</h1>
            <input
              type="text"
              placeholder="Video Title"
              className="border border-black px-3 py-2 mt-2 outline-0 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4 mt-4">
            <h1 className="text-black">DESCRIPTION (optional)</h1>
            <textarea
              placeholder="Description"
              className="border border-black px-3 py-2 mt-2 outline-0 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-black text-white px-6 py-2 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save video section"}
            </button>
            <span className="text-sm text-gray-600">
              {hasVideo
                ? "This section is showing on the website."
                : "Nothing set - the section is hidden on the website."}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoSection;
