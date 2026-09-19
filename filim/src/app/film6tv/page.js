"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Loading from "@/components/faq/Loading";
import FilmGrid from "@/components/Film6TV/FilmGrid";
import FilmPlayer from "@/components/Film6TV/FilmPlayer";
import { API_BASE_URL } from "@/utils/backend";
import { groupByCategory, isPlayable } from "@/utils/film6tv";

// FILM6 TV.
//
// Built to be filled from the admin panel and to grow: the films, the rows they
// sit in, the headline and the film-maker pitch all come from the database, so
// nothing on this page needs a deploy to change. Adding accounts and film-maker
// uploads later means adding to this, not replacing it.
const Film6TVPage = () => {
  const [films, setFilms] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [filmsRes, settingsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/film6tv/getfilms`),
          axios.get(`${API_BASE_URL}/film6tv/settings`),
        ]);
        setFilms(filmsRes.data?.films || []);
        setSettings(settingsRes.data?.film6tv || null);
      } catch (error) {
        console.error("Error loading FILM6 TV:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Loading />;

  const libraryId = settings?.bunnyLibraryId || "";
  // A film whose video is missing, or whose Bunny library is not set up yet,
  // would be an empty tile. Filter before grouping so an entire row disappears
  // when none of its films can play, rather than leaving a bare heading.
  const playable = films.filter((film) => isPlayable(film, libraryId));
  const rows = groupByCategory(playable, settings?.rowOrder || []);

  const hero = settings?.hero || {};
  const cta = settings?.cta || {};

  return (
    <div className="bg-black min-h-screen">
      {/* Header. Kept as type on black rather than a picture: with no films
          loaded yet a large empty image reads as broken, whereas type does not. */}
      <section className="px-4 sm:px-6 lg:px-20 pt-32 pb-8 relative">
        {hero.bgImage && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={hero.bgImage}
              alt={hero.alt || ""}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          </div>
        )}

        <div className="relative">
          <h1 className="text-3xl sm:text-5xl text-white font-semibold">
            {hero.title || "FILM6 TV"}
          </h1>
          {hero.description && (
            <p className="text-sm sm:text-lg text-gray-300 mt-4 max-w-3xl">
              {hero.description}
            </p>
          )}
        </div>
      </section>

      {rows.length > 0 ? (
        rows.map(([category, list]) => (
          <FilmGrid
            key={category}
            title={category}
            films={list}
            bunnyLibraryId={libraryId}
            onSelect={setSelected}
          />
        ))
      ) : (
        // An honest empty state. Better than an empty page while the catalogue
        // is being prepared, and it disappears the moment a film is published.
        <section className="px-4 sm:px-6 lg:px-20 py-16">
          <p className="text-gray-400">
            The first films are being added. Check back shortly.
          </p>
        </section>
      )}

      {/* The reason this page exists before the festival: somewhere to point a
          film-maker. */}
      {(cta.title || cta.description) && (
        <section className="px-4 sm:px-6 lg:px-20 py-16 border-t border-neutral-800">
          <div className="max-w-3xl">
            {cta.title && (
              <h2 className="text-2xl sm:text-3xl text-white font-semibold">
                {cta.title}
              </h2>
            )}
            {cta.description && (
              <p className="text-sm sm:text-base text-gray-300 mt-4">
                {cta.description}
              </p>
            )}
            {cta.buttonText && (
              <Link
                href={cta.buttonLink || "/contact"}
                className="inline-block mt-6 border border-white text-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
              >
                {cta.buttonText}
              </Link>
            )}

            {/* Deliberately empty until FILM6 writes it. Nothing a film-maker
                agrees to should be invented by the website. */}
            {settings?.legalText && (
              <p className="text-xs text-gray-500 mt-8 whitespace-pre-line">
                {settings.legalText}
              </p>
            )}
          </div>
        </section>
      )}

      <FilmPlayer
        film={selected}
        bunnyLibraryId={libraryId}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};

export default Film6TVPage;
