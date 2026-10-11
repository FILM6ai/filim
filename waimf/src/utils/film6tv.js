// Where a FILM6 TV film actually plays from.
//
// Two providers are supported deliberately. YouTube fills the page today;
// Bunny Stream is what a film-maker is promised - their film on FILM6's own
// platform rather than on a public account they do not control. A film moves
// between them by changing two fields, so the catalogue can be migrated one
// title at a time instead of all at once.

import { playerSrc } from "./youtube";

// Bunny serves its player from one host for every library; the library id is
// part of the path, not the hostname.
const BUNNY_EMBED = "https://iframe.mediadelivery.net/embed";

export const filmPlayerSrc = (film, bunnyLibraryId) => {
  if (!film) return "";

  if (film.provider === "bunny") {
    // Without a library id there is nothing to build a URL from. Returning
    // empty lets the caller hide the tile rather than render a broken frame.
    if (!bunnyLibraryId || !film.bunnyVideoId) return "";
    return `${BUNNY_EMBED}/${bunnyLibraryId}/${film.bunnyVideoId}?autoplay=true&preload=false`;
  }

  if (!film.youtubeUrl) return "";
  // Same caption and related-video handling as every other embed on the site.
  return playerSrc(`${film.youtubeUrl}?rel=0&controls=1&autoplay=1`);
};

// A film with no playable source must never reach the page - it would render as
// an empty black rectangle among real ones.
export const isPlayable = (film, bunnyLibraryId) =>
  Boolean(filmPlayerSrc(film, bunnyLibraryId));

// Bunny generates a thumbnail for every video, so a film hosted there needs no
// separate poster upload unless one is wanted.
export const filmPoster = (film, bunnyLibraryId) => {
  if (film?.poster) return film.poster;
  if (film?.provider === "bunny" && bunnyLibraryId && film.bunnyVideoId) {
    return `https://vz-${bunnyLibraryId}.b-cdn.net/${film.bunnyVideoId}/thumbnail.jpg`;
  }
  // YouTube's still is derivable from the id already stored in the embed URL.
  const match = String(film?.youtubeUrl || "").match(
    /embed\/([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg` : "";
};

// Groups films into the rows the page draws, honouring the order set in the
// panel and putting anything unlisted afterwards rather than dropping it.
export const groupByCategory = (films, rowOrder = []) => {
  const groups = new Map();
  for (const film of films) {
    const key = (film.category || "Films").trim() || "Films";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(film);
  }

  const ordered = [];
  for (const name of rowOrder) {
    if (groups.has(name)) {
      ordered.push([name, groups.get(name)]);
      groups.delete(name);
    }
  }
  for (const [name, list] of groups) ordered.push([name, list]);
  return ordered;
};

// Bunny renders a short animated preview for every video it stores. Swapping a
// still for this on hover is the whole trick behind how alive the best sites in
// this space feel - and it costs nothing extra, because Bunny generates it
// whether we use it or not.
//
// YouTube has no public equivalent, so those films stay still. That asymmetry is
// worth knowing: it is a concrete reason to move a catalogue onto Bunny beyond
// ownership.
export const filmPreview = (film, bunnyLibraryId) => {
  if (film?.provider !== "bunny" || !bunnyLibraryId || !film.bunnyVideoId) {
    return "";
  }
  return `https://vz-${bunnyLibraryId}.b-cdn.net/${film.bunnyVideoId}/preview.webp`;
};

// The films shown full width at the top of the page. Falls back to the newest
// playable film so the hero is never empty just because nobody ticked a box.
export const featuredFilms = (films, bunnyLibraryId) => {
  const playable = films.filter((film) => isPlayable(film, bunnyLibraryId));
  const flagged = playable.filter((film) => film.featured);
  return flagged.length > 0 ? flagged : playable.slice(0, 1);
};
