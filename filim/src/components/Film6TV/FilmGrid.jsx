"use client";

import React from "react";
import { Play } from "lucide-react";
import { filmPoster } from "@/utils/film6tv";

// One row of the catalogue: a heading and its films.
//
// A responsive grid rather than a Netflix-style sideways rail. With three films
// a rail looks like a mistake; a grid looks deliberate at any count, which
// matters more for a page that starts small and fills up over a festival.
const FilmGrid = ({ title, films, bunnyLibraryId, onSelect }) => {
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

          return (
            <button
              key={film._id}
              type="button"
              onClick={() => onSelect(film)}
              className="group text-left focus:outline-none focus:ring-2 focus:ring-white/60"
              aria-label={`Play ${film.title}`}
            >
              <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden">
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

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
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
