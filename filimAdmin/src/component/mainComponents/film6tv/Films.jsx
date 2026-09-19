"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "@/utils/backend";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";

// The FILM6 TV catalogue editor.
//
// Saves through /api/film6tv, whose handlers write only the fields they are
// given - so editing one film cannot disturb another, and editing the headline
// cannot disturb the films.

const EMPTY = {
  title: "",
  synopsis: "",
  director: "",
  year: "",
  duration: "",
  category: "Films",
  order: 0,
  poster: "",
  alt: "",
  provider: "youtube",
  youtubeUrl: "",
  bunnyVideoId: "",
  featured: false,
  published: true,
};

const Films = () => {
  const [films, setFilms] = useState([]);
  const [settings, setSettings] = useState(null);
  const [draft, setDraft] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const base = `${BACKEND_URL}/api/film6tv`;
  const containerId = "film6tv-films";

  const load = async () => {
    try {
      // ?all=1 so unpublished films appear here but not on the website.
      const [filmsRes, settingsRes] = await Promise.all([
        axios.get(`${base}/getfilms?all=1`),
        axios.get(`${base}/settings`),
      ]);
      setFilms(filmsRes.data?.films || []);
      setSettings(settingsRes.data?.film6tv || null);
    } catch (error) {
      console.error("Failed to load FILM6 TV:", error);
      toast.error("Could not load FILM6 TV", { containerId });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const startEdit = (film) => {
    setEditingId(film._id);
    setDraft({ ...EMPTY, ...film });
    setPosterFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId("");
    setDraft(EMPTY);
    setPosterFile(null);
  };

  const handleSave = async () => {
    if (!draft.title.trim()) {
      toast.error("Give the film a title", { containerId });
      return;
    }
    if (draft.provider === "youtube" && !draft.youtubeUrl.trim()) {
      toast.error("Paste the YouTube link, or switch to Bunny", { containerId });
      return;
    }
    if (draft.provider === "bunny" && !draft.bunnyVideoId.trim()) {
      toast.error("Paste the Bunny video id, or switch to YouTube", { containerId });
      return;
    }

    setSaving(true);
    try {
      let poster = draft.poster;
      // Uploaded straight to Cloudinary from the browser, so a large poster
      // never passes through the backend's request size limit.
      if (posterFile) poster = await uploadToCloudinary(posterFile);

      const payload = { ...draft, poster };

      if (editingId) {
        const { data } = await axios.put(`${base}/film/${editingId}`, payload);
        if (data?.warning) toast.warn(data.warning, { containerId });
      } else {
        await axios.post(`${base}/film`, payload);
      }

      toast.success(editingId ? "Film updated" : "Film added", { containerId });
      cancelEdit();
      await load();
    } catch (error) {
      console.error("Failed to save film:", error);
      toast.error(
        error?.response?.data?.message || "Save failed",
        { containerId },
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (film) => {
    // Deleting a film cannot be undone from here, so it asks first.
    if (!window.confirm(`Remove "${film.title}" from FILM6 TV?`)) return;
    try {
      await axios.delete(`${base}/film/${film._id}`);
      toast.success("Removed", { containerId });
      if (editingId === film._id) cancelEdit();
      await load();
    } catch (error) {
      console.error("Failed to delete film:", error);
      toast.error("Delete failed", { containerId });
    }
  };

  const togglePublished = async (film) => {
    try {
      await axios.put(`${base}/film/${film._id}`, { published: !film.published });
      await load();
    } catch (error) {
      console.error("Failed to change visibility:", error);
      toast.error("Could not change visibility", { containerId });
    }
  };

  const input = "border border-black px-3 py-2 outline-0 w-full";

  return (
    <div className="p-4 border mt-10">
      <ToastContainer containerId={containerId} position="top-right" autoClose={3000} />

      <h1 className="text-black pt-4 font-semibold text-lg">
        FILM6 TV - FILMS
      </h1>
      <p className="text-sm text-gray-600 mt-1">
        Everything here appears on the FILM6 TV page. A film set to Hidden stays
        in this list but does not appear on the website.
      </p>

      {loading ? (
        <p className="mt-4 text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="mt-6 border border-yellow-400 p-4">
            <h2 className="text-black font-semibold mb-4">
              {editingId ? "EDIT FILM" : "ADD A FILM"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-black text-sm">Title</label>
                <input
                  className={input}
                  value={draft.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </div>
              <div>
                <label className="text-black text-sm">
                  Row on the page (Films, Short Films, Trailers...)
                </label>
                <input
                  className={input}
                  value={draft.category}
                  onChange={(e) => set("category", e.target.value)}
                />
              </div>
              <div>
                <label className="text-black text-sm">Director</label>
                <input
                  className={input}
                  value={draft.director}
                  onChange={(e) => set("director", e.target.value)}
                />
              </div>
              <div>
                <label className="text-black text-sm">Year</label>
                <input
                  className={input}
                  value={draft.year}
                  onChange={(e) => set("year", e.target.value)}
                />
              </div>
              <div>
                <label className="text-black text-sm">Duration (e.g. 12 min)</label>
                <input
                  className={input}
                  value={draft.duration}
                  onChange={(e) => set("duration", e.target.value)}
                />
              </div>
              <div>
                <label className="text-black text-sm">
                  Order in the row (lower shows first)
                </label>
                <input
                  type="number"
                  className={input}
                  value={draft.order}
                  onChange={(e) => set("order", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-black text-sm">Synopsis</label>
              <textarea
                className={input}
                rows={3}
                value={draft.synopsis}
                onChange={(e) => set("synopsis", e.target.value)}
              />
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-black font-semibold mb-2">WHERE THE FILM PLAYS FROM</h3>
              <div className="flex gap-6 mb-3">
                <label className="flex items-center gap-2 text-black">
                  <input
                    type="radio"
                    checked={draft.provider === "youtube"}
                    onChange={() => set("provider", "youtube")}
                  />
                  YouTube
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input
                    type="radio"
                    checked={draft.provider === "bunny"}
                    onChange={() => set("provider", "bunny")}
                  />
                  Bunny Stream
                </label>
              </div>

              {draft.provider === "youtube" ? (
                <input
                  className={input}
                  placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                  value={draft.youtubeUrl}
                  onChange={(e) => set("youtubeUrl", e.target.value)}
                />
              ) : (
                <>
                  <input
                    className={input}
                    placeholder="Bunny video id (the long code from your Bunny library)"
                    value={draft.bunnyVideoId}
                    onChange={(e) => set("bunnyVideoId", e.target.value)}
                  />
                  {!settings?.bunnyLibraryId && (
                    <p className="text-sm text-red-600 mt-2">
                      No Bunny library is set yet, so films on Bunny will not play.
                      Add the library id in the FILM6 TV Page section below.
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-black font-semibold mb-2">POSTER (optional)</h3>
              <p className="text-sm text-gray-600 mb-2">
                Leave empty and the still from the video is used automatically.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
              />
              {(posterFile || draft.poster) && (
                <img
                  src={posterFile ? URL.createObjectURL(posterFile) : draft.poster}
                  alt=""
                  className="w-48 h-28 object-cover mt-3"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => set("published", e.target.checked)}
                />
                Show on the website
              </label>
              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />
                Featured
              </label>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-black text-white px-6 py-2 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Save changes" : "Add film"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="border border-black px-6 py-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-black font-semibold mb-3">
              CATALOGUE ({films.length})
            </h2>

            {films.length === 0 ? (
              <p className="text-gray-500">No films yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {films.map((film) => (
                  <div
                    key={film._id}
                    className="border p-3 flex flex-wrap items-center gap-4"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-black font-medium">
                        {film.title}{" "}
                        {!film.published && (
                          <span className="text-xs text-white bg-gray-500 px-2 py-0.5 ml-2">
                            HIDDEN
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {[film.category, film.director, film.duration,
                          film.provider === "bunny" ? "Bunny" : "YouTube"]
                          .filter(Boolean)
                          .join("  ·  ")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePublished(film)}
                      className="border border-black px-3 py-1 text-sm"
                    >
                      {film.published ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(film)}
                      className="border border-black px-3 py-1 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(film)}
                      className="bg-red-500 text-white px-3 py-1 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Films;
