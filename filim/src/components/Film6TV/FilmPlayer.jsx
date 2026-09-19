"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { filmPlayerSrc } from "@/utils/film6tv";

// The overlay that plays a film when a poster is clicked.
//
// The iframe is mounted only while a film is open. Leaving players in the page
// behind a hidden class means every film on the page loads its provider's script
// on first paint, which on a catalogue of any size is both slow and, on Bunny,
// billable.
const FilmPlayer = ({ film, bunnyLibraryId, onClose }) => {
  // Escape closes it, and the page behind must not scroll while it is open.
  useEffect(() => {
    if (!film) return;

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [film, onClose]);

  if (!film) return null;

  const src = filmPlayerSrc(film, bunnyLibraryId);
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={film.title}
    >
      <div
        className="relative w-full max-w-5xl"
        // Clicks inside the player must not close it - only the backdrop does.
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-12 right-0 text-white hover:text-gray-300 flex items-center gap-2"
        >
          <span className="text-sm">Close</span>
          <X size={24} />
        </button>

        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={src}
            title={film.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        {(film.title || film.synopsis) && (
          <div className="mt-4 text-white">
            <h3 className="text-xl sm:text-2xl font-semibold">{film.title}</h3>
            <p className="text-sm text-gray-400 mt-1">
              {[film.director && `Directed by ${film.director}`, film.year, film.duration]
                .filter(Boolean)
                .join("  ·  ")}
            </p>
            {film.synopsis && (
              <p className="text-sm sm:text-base text-gray-300 mt-3 max-w-3xl">
                {film.synopsis}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmPlayer;
