"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "@/utils/backend";

// The FILM6 TV page furniture: headline, the film-maker pitch, the legal slot
// and the Bunny library id.
//
// Separate from the catalogue on purpose - saving a headline should not be able
// to touch a film, and the backend writes these through dotted paths so it
// cannot.
const PageSettings = () => {
  const [hero, setHero] = useState({ title: "", description: "", bgImage: "", alt: "" });
  const [cta, setCta] = useState({ title: "", description: "", buttonText: "", buttonLink: "" });
  const [legalText, setLegalText] = useState("");
  const [bunnyLibraryId, setBunnyLibraryId] = useState("");
  const [rowOrder, setRowOrder] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const endpoint = `${BACKEND_URL}/api/film6tv/settings`;
  const containerId = "film6tv-settings";

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(endpoint);
        const s = data?.film6tv || {};
        setHero({ title: "", description: "", bgImage: "", alt: "", ...(s.hero || {}) });
        setCta({ title: "", description: "", buttonText: "", buttonLink: "", ...(s.cta || {}) });
        setLegalText(s.legalText || "");
        setBunnyLibraryId(s.bunnyLibraryId || "");
        setRowOrder((s.rowOrder || []).join(", "));
      } catch (error) {
        console.error("Failed to load FILM6 TV settings:", error);
        toast.error("Could not load the page settings", { containerId });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [endpoint]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(endpoint, {
        hero,
        cta,
        legalText,
        bunnyLibraryId,
        // Typed as a comma separated list because that is how someone thinks
        // about the order of rows on a page.
        rowOrder: rowOrder
          .split(",")
          .map((row) => row.trim())
          .filter(Boolean),
      });
      toast.success("Page saved", { containerId });
    } catch (error) {
      console.error("Failed to save FILM6 TV settings:", error);
      toast.error("Save failed", { containerId });
    } finally {
      setSaving(false);
    }
  };

  const input = "border border-black px-3 py-2 outline-0 w-full";

  return (
    <div className="p-4 border mt-10">
      <ToastContainer containerId={containerId} position="top-right" autoClose={3000} />

      <h1 className="text-black pt-4 font-semibold text-lg">FILM6 TV - PAGE</h1>
      <p className="text-sm text-gray-600 mt-1">
        The wording around the films. The films themselves are in the section above.
      </p>

      {loading ? (
        <p className="mt-4 text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="mt-6 border border-yellow-400 p-4">
            <h2 className="text-black font-semibold mb-3">TOP OF THE PAGE</h2>
            <label className="text-black text-sm">Title</label>
            <input
              className={input}
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
            />
            <label className="text-black text-sm mt-3 block">Description</label>
            <textarea
              className={input}
              rows={3}
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
            />
          </div>

          <div className="mt-6 border border-yellow-400 p-4">
            <h2 className="text-black font-semibold mb-3">
              MESSAGE TO FILM-MAKERS
            </h2>
            <label className="text-black text-sm">Title</label>
            <input
              className={input}
              value={cta.title}
              onChange={(e) => setCta({ ...cta, title: e.target.value })}
            />
            <label className="text-black text-sm mt-3 block">Description</label>
            <textarea
              className={input}
              rows={3}
              value={cta.description}
              onChange={(e) => setCta({ ...cta, description: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="text-black text-sm">Button text</label>
                <input
                  className={input}
                  value={cta.buttonText}
                  onChange={(e) => setCta({ ...cta, buttonText: e.target.value })}
                />
              </div>
              <div>
                <label className="text-black text-sm">Button goes to</label>
                <input
                  className={input}
                  placeholder="/contact"
                  value={cta.buttonLink}
                  onChange={(e) => setCta({ ...cta, buttonLink: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 border border-yellow-400 p-4">
            <h2 className="text-black font-semibold mb-2">
              SMALL PRINT (your wording)
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Left deliberately empty. Anything a film-maker is asked to agree to
              should be written by you, not by me. Leave it blank and nothing
              appears on the page.
            </p>
            <textarea
              className={input}
              rows={4}
              value={legalText}
              onChange={(e) => setLegalText(e.target.value)}
            />
          </div>

          <div className="mt-6 border border-yellow-400 p-4">
            <h2 className="text-black font-semibold mb-2">BUNNY STREAM</h2>
            <p className="text-sm text-gray-600 mb-2">
              The video library id from your bunny.net account. Needed only for
              films set to play from Bunny.
            </p>
            <input
              className={input}
              placeholder="e.g. 123456"
              value={bunnyLibraryId}
              onChange={(e) => setBunnyLibraryId(e.target.value)}
            />
          </div>

          <div className="mt-6 border border-yellow-400 p-4">
            <h2 className="text-black font-semibold mb-2">ORDER OF THE ROWS</h2>
            <p className="text-sm text-gray-600 mb-2">
              Comma separated, top to bottom. Any row not listed appears after
              these, so nothing disappears if you forget one.
            </p>
            <input
              className={input}
              placeholder="Featured, Short Films, Trailers"
              value={rowOrder}
              onChange={(e) => setRowOrder(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-black text-white px-6 py-2 mt-6 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save page"}
          </button>
        </>
      )}
    </div>
  );
};

export default PageSettings;
