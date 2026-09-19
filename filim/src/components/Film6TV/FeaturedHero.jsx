"use client";

import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { filmPoster } from "@/utils/film6tv";

// The full-bleed film at the top of FILM6 TV.
//
// One film given the whole screen, rather than a grid starting immediately. It
// is the single largest difference between a page that looks like a catalogue
// and one that looks like a service.
//
// The still is shown at full sharpness and immediately. The reference sites in
// this space put a heavily compressed video there instead, which is why their
// headers look soft for the first second - a still costs nothing and never
// blurs.
const FeaturedHero = ({ films, bunnyLibraryId, onPlay }) => {
  const [index, setIndex] = useState(0);

  // Rotate through the featured films. Paused entirely when there is only one,
  // so a single-film catalogue does not run a pointless timer.
  useEffect(() => {
    if (films.length < 2) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % films.length),
      9000,
    );
    return () => clearInterval(timer);
  }, [films.length]);

  if (!films || films.length === 0) return null;

  const film = films[Math.min(index, films.length - 1)];
  const poster = filmPoster(film, bunnyLibraryId);
  const laurels = [film.edition, ...(film.laurels || [])].filter(Boolean);

  return (
    <section className="relative w-full min-h-[68vh] md:min-h-[82vh] flex items-end overflow-hidden bg-black">
      {poster && (
        <img
          key={poster}
          src={poster}
          alt={film.alt || film.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Two gradients, not one: upward so the text has something to sit on,
          and leftward so it stays readable over a busy right-hand side. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

      {laurels.length > 0 && (
        <div className="absolute top-24 right-4 md:right-12 flex flex-wrap justify-end gap-3 max-w-[55%]">
          {laurels.map((laurel) => (
            <span
              key={laurel}
              className="text-[10px] md:text-xs tracking-widest uppercase text-white/80 border border-white/30 px-3 py-1.5"
            >
              {laurel}
            </span>
          ))}
        </div>
      )}

      <div className="relative w-full px-4 sm:px-6 lg:px-20 pb-12 md:pb-20">
        {film.titleImage ? (
          <img
            src={film.titleImage}
            alt={film.title}
            className="max-w-[80%] md:max-w-md mb-4"
          />
        ) : (
          <h1 className="text-3xl sm:text-5xl md:text-6xl text-white font-semibold tracking-wide max-w-3xl">
            {film.title}
          </h1>
        )}

        <p className="text-xs md:text-sm text-gray-300 mt-3 tracking-wider uppercase">
          {[film.director && `Directed by ${film.director}`, film.year, film.duration]
            .filter(Boolean)
            .join("   ·   ")}
        </p>

        {film.synopsis && (
          <p className="text-sm md:text-lg text-gray-200 mt-4 max-w-2xl leading-relaxed">
            {film.synopsis}
          </p>
        )}

        <div className="flex items-center gap-6 mt-7">
          <button
            type="button"
            onClick={() => onPlay(film)}
            className="flex items-center gap-3 bg-white text-black px-7 py-3 hover:bg-gray-200 transition-colors"
          >
            <Play size={20} fill="currentColor" />
            <span className="tracking-wider text-sm font-medium">
              START WATCHING
            </span>
          </button>
        </div>

        {films.length > 1 && (
          <div className="flex gap-2 mt-8">
            {films.map((item, i) => (
              <button
                key={item._id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${item.title}`}
                className={`h-[3px] w-10 transition-colors ${
                  i === index ? "bg-white" : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedHero;
