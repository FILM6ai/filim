"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import { filmPoster, filmPreview } from "@/utils/film6tv";

// One row of the catalogue: a heading and its films.
//
// A responsive grid rather than a Netflix-style sideways rail. With three films
// a rail looks like a mistake; a grid looks deliberate at any count, which
// matters more for a page that starts small and fills up over a festival.
const FilmGrid = ({ title, films, bunnyLibraryId, onSelect }) => {
  // Only the tile being pointed at loads its animated preview. Loading all of
  // them would pull a few hundred kilobytes per film on first paint for
  // something nobody has looked at yet.
  const [hovered, setHovered] = useState("");

  if (!films || films.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-20 py-10">
      {title && (
        <h2 className="text-xl sm:text-2xl text-white font-semibold mb-6">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {films.map((film) => {
          const poster = filmPoster(film, bunnyLibraryId);
          const preview = filmPreview(film, bunnyLibraryId);
          const showPreview = preview && hovered === film._id;
          const laurel = film.edition || (film.laurels || [])[0];

          return (
            <button
              key={film._id}
              type="button"
              onClick={() => onSelect(film)}
              onMouseEnter={() => setHovered(film._id)}
              onMouseLeave={() => setHovered("")}
              onFocus={() => setHovered(film._id)}
              onBlur={() => setHovered("")}
              className="group text-left focus:outline-none focus:ring-2 focus:ring-white/60"
              aria-label={`Play ${film.title}`}
            >
              <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden">
                {showPreview && (
                  // Sits on top of the still rather than replacing it, so the
                  // tile never flashes empty while the preview loads.
                  <img
                    src={preview}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover z-10"
                  />
                )}
                {poster ? (
                  // A plain img, not next/image: posters come from YouTube,
                  // Bunny and Cloudinary, and the optimiser only accepts hosts
                  // listed in next.config. A new provider must never silently
                  // stop posters rendering.
                  <img
                    src={poster}
                    alt={film.alt || film.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs px-2 text-center">
                    {film.title}
                  </div>
                )}

                {laurel && (
                  <span className="absolute top-2 left-2 z-20 text-[9px] tracking-widest uppercase text-white/90 bg-black/60 px-2 py-1">
                    {laurel}
                  </span>
                )}

                <div className="absolute inset-0 z-20 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-black/70 rounded-full p-3 text-white">
                    <Play size={24} />
                  </span>
                </div>
              </div>

              <h3 className="text-white text-sm sm:text-base mt-3 leading-tight">
                {film.title}
              </h3>
              {(film.director || film.duration) && (
                <p className="text-xs text-gray-400 mt-1">
                  {[film.director, film.duration].filter(Boolean).join("  ·  ")}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default FilmGrid;
