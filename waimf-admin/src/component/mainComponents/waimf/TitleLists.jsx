'use client';

import { useState } from 'react';

// The Official Selection as two plain lists of titles, one film per line.
//
// Francois: "make it simple, like two categories one FINALISTS the other
// OFFICIAL SELECTION, and for each we shall be able to paste a list of title".
// With well over a hundred films, a row-per-film editor is unusable, so the
// text box IS the list: paste, edit a line, delete a line, reorder by moving
// lines. What is in the box when "Save this section" is pressed is exactly what
// the website shows.
//
// Each line is a whole title, never split into title and director: the lists
// are titles, and splitting on " - " turned "Still Walking - AI Zombie
// Universe" into a film by "AI Zombie Universe". A YouTube address anywhere on
// a line is taken off the title and links it on the website.

const YT = /(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)[A-Za-z0-9_-]{11}\S*/i;

const FINALIST = 'Finalist';

// How a stored film reads back as a line. Films saved before this screen may
// have a director (in practice a subtitle the old reader split off); it goes
// back onto the title so the line reads as it was pasted.
const toLine = (film) =>
  [[film.title, film.director].filter(Boolean).join(' - '), film.youtubeUrl]
    .filter(Boolean)
    .join('  ');

const key = (title) => String(title || '').trim().toLowerCase().replace(/\s+/g, ' ');

const toText = (films) => films.map(toLine).join('\n');

// Lines back into films. Anything already stored for the same title (a poster,
// a running time) is kept, so saving the list never strips extra details.
const toFilms = (text, category, previous) => {
  const known = new Map(previous.map((film) => [key(toLine({ ...film, youtubeUrl: '' })), film]));
  const films = [];
  for (const raw of String(text || '').split(/\r?\n/)) {
    let line = raw.trim();
    if (!line) continue;
    let youtubeUrl = '';
    const yt = line.match(YT);
    if (yt) {
      youtubeUrl = yt[0].startsWith('http') ? yt[0] : `https://${yt[0]}`;
      line = line.replace(yt[0], ' ');
    }
    // List numbering and bullets ("12. ", "3) ", "• ") are not part of a title.
    const title = line
      .replace(/^(\d{1,3}[.)]|[•·*–-])\s+/, '')
      .replace(/\s+/g, ' ')
      .replace(/[\s|,;:–-]+$/, '')
      .trim();
    if (!title) continue;
    const before = known.get(key(title)) || {};
    films.push({
      ...before,
      category,
      title,
      director: '',
      youtubeUrl: youtubeUrl || '',
    });
  }
  return films;
};

const countLines = (text) => String(text || '').split(/\r?\n/).filter((l) => l.trim()).length;

const TitleLists = ({ items, onChange }) => {
  const all = Array.isArray(items) ? items : [];
  const [previous] = useState(all);
  const [finalists, setFinalists] = useState(() =>
    toText(all.filter((f) => (f.category || '').trim() && (f.title || '').trim())),
  );
  const [official, setOfficial] = useState(() =>
    toText(all.filter((f) => !(f.category || '').trim() && (f.title || '').trim())),
  );

  const push = (finalText, officialText) =>
    onChange([
      ...toFilms(finalText, FINALIST, previous),
      ...toFilms(officialText, '', previous),
    ]);

  const finalKeys = new Set(
    toFilms(finalists, FINALIST, []).map((f) => key(f.title)),
  );
  const inBoth = toFilms(official, '', []).filter((f) => finalKeys.has(key(f.title))).length;

  const Box = ({ label, hint, value, set, other, first }) => (
    <label className='block'>
      <span className='flex items-baseline justify-between'>
        <span className='text-base font-semibold text-black'>{label}</span>
        <span className='text-xs text-gray-500'>{countLines(value)} films</span>
      </span>
      <span className='block text-xs text-gray-500 mt-0.5 mb-2'>{hint}</span>
      <textarea
        rows={18}
        value={value}
        spellCheck={false}
        onChange={(e) => {
          set(e.target.value);
          if (first) push(e.target.value, other);
          else push(other, e.target.value);
        }}
        placeholder={'Azul Cobalto\nThe Last Span\nNoor'}
        className='border border-black px-3 py-2 outline-0 w-full text-sm leading-6 font-mono'
      />
    </label>
  );

  return (
    <div className='mb-8'>
      <p className='text-sm text-gray-700 mb-4'>
        One film title per line. Paste a whole list in one go, or edit, add and
        delete lines. The order here is the order on the website. To link a
        title to its film, put the YouTube address on the same line. Then press
        Save this section.
      </p>
      <div className='grid lg:grid-cols-2 gap-6'>
        {/* Called as functions, not <Box />: a component declared inside the
            render is a new type each time, which would remount the textarea
            and lose the cursor on every keystroke. */}
        {Box({
          label: 'FINALISTS',
          hint: 'Shown first, in gold, on the website and on the front page.',
          value: finalists,
          set: setFinalists,
          other: official,
          first: true,
        })}
        {Box({
          label: 'OFFICIAL SELECTION',
          hint: 'The rest of the selection, shown under the finalists.',
          value: official,
          set: setOfficial,
          other: finalists,
          first: false,
        })}
      </div>
      {inBoth > 0 && (
        <p className='text-xs text-gray-600 mt-3'>
          Note: {inBoth} {inBoth === 1 ? 'title is' : 'titles are'} in both lists, so{' '}
          {inBoth === 1 ? 'it appears' : 'they appear'} twice on the Official Selection page.
          That is fine if the finalists are part of the selection; delete those lines
          from the second box if not.
        </p>
      )}
    </div>
  );
};

export default TitleLists;
