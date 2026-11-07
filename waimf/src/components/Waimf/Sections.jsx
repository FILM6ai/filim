'use client';

import Link from 'next/link';
import { cdn, portrait, tile } from '@/utils/image';
import slugify from 'slugify';
import { useState } from 'react';

// The building blocks of waimf.org, in one file because they share a single
// visual language and are meaningless apart. Each one takes its content as
// props and renders NOTHING when that content is empty - so a section Francois
// has not filled in yet simply is not there, rather than appearing as an empty
// box with a heading.
//
// Design notes, since they were deliberate rather than default:
//  - serif for display type, because the WAIMF wordmark is a serif. This is
//    what stops the site reading as a generic template.
//  - gold (#C8A24A) only for small accents: eyebrows, rules, numbers.
//  - dark bands for the hero, the winners and the contact strip; white for
//    everything between, which is the contrast Francois asked for.

import { playerSrc } from '@/utils/youtube';

const GOLD = '#C8A24A';

// "OFFICIAL SELECTION" sitting directly above the heading "Official Selection"
// is the site saying the same thing twice, which Francois spotted. Rather than
// deleting that eyebrow in one place and leaving the same fault on Gallery,
// Rules and the rest, the rule lives here: an eyebrow that only repeats the
// heading is dropped. Compared loosely so "Official Selection" and "OFFICIAL
// SELECTION " count as the same words.
const sameWords = (a, b) =>
  String(a || '').trim().toLowerCase().replace(/\s+/g, ' ') ===
  String(b || '').trim().toLowerCase().replace(/\s+/g, ' ');

const showEyebrow = (eyebrow, title) =>
  eyebrow && !sameWords(eyebrow, title) ? eyebrow : null;

// Used by both film grids, so it is declared once, above both of them.
const youtubeId = (url) => {
  const m = String(url || '').match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return m ? m[1] : '';
};

export const Shell = ({ children, className = '' }) => (
  <div className={`max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14 ${className}`}>
    {children}
  </div>
);

export const SectionHead = ({ eyebrow, title, sub, action }) => (
  <div className='flex flex-col md:flex-row md:justify-between md:items-end gap-8 mb-12'>
    <div className='max-w-[62ch]'>
      {showEyebrow(eyebrow, title) && (
        <div
          className='text-[10.5px] tracking-[0.34em] uppercase mb-4'
          style={{ color: GOLD }}
        >
          {showEyebrow(eyebrow, title)}
        </div>
      )}
      {title && (
        <h2 className='font-serif text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.08] font-normal'>
          {title}
        </h2>
      )}
      {sub && (
        <p className='text-[15.5px] leading-[1.72] text-neutral-600 mt-4 max-w-[58ch] whitespace-pre-line'>
          {sub}
        </p>
      )}
    </div>
    {action}
  </div>
);

// Optional longer text under a section heading, written in the panel to
// describe the section in depth (and give search engines real words to read).
// Renders nothing when empty. Paragraph breaks typed in the panel are kept.
export const Intro = ({ text, dark = false, className = 'mb-10' }) => {
  const body = String(text || '').trim();
  if (!body) return null;
  return (
    <div
      className={`whitespace-pre-line text-[15.5px] leading-[1.75] max-w-[80ch] ${
        dark ? 'text-neutral-300' : 'text-neutral-600'
      } ${className}`}
    >
      {body}
    </div>
  );
};

export const Pill = ({ href = '#', children, dark = false }) => (
  <Link
    href={href}
    className={`inline-block rounded-full px-6 py-3 text-[10.5px] tracking-[0.17em] uppercase whitespace-nowrap border transition-colors ${
      dark
        ? 'border-neutral-600 hover:border-neutral-400'
        : 'border-neutral-300 hover:border-neutral-500'
    }`}
    style={dark ? { color: GOLD } : undefined}
  >
    {children}
  </Link>
);

/* ------------------------------------------------------------------ hero -- */

// "SUBMIT YOUR FILM" - the call for WAIMF 2027 entries (Francois, 7 Nov), on
// the landing header (centred at the bottom, like film6.ai/festival) and on
// the Top Filmmakers and Official Selection headers. Text and link come from
// the panel (Header tab); until set there they default to FilmFreeWay. A
// single dash as the text hides it everywhere.
export const SUBMIT_DEFAULT = { text: 'Submit your film', link: 'https://filmfreeway.com/WAIMF' };

export const submitOf = (hero) => {
  const text = String(hero?.submitText || '').trim() || SUBMIT_DEFAULT.text;
  const link = String(hero?.submitLink || '').trim() || SUBMIT_DEFAULT.link;
  return text === '-' ? null : { text, link };
};

export const SubmitButton = ({ hero, className = '' }) => {
  const cta = submitOf(hero);
  if (!cta) return null;
  return (
    <a
      href={cta.link}
      {...outside(cta.link)}
      className={`inline-flex items-center justify-center px-9 py-[15px] text-[12px] tracking-[0.2em] uppercase font-semibold border bg-black/55 backdrop-blur-[2px] hover:bg-black/75 transition-colors ${className}`}
      style={{ borderColor: GOLD, color: GOLD }}
    >
      {cta.text}
    </a>
  );
};

// A header button pointing off the site (FilmFreeWay for submissions) opens in
// a new tab, so visitors keep waimf.org open behind it.
const outside = (href) =>
  /^https?:\/\//i.test(String(href || '').trim())
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

export const Hero = ({ hero }) => {
  if (!hero) return null;
  const bg = Array.isArray(hero.bgImage) ? hero.bgImage.at(-1) : hero.bgImage;
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(String(bg || ''));

  // How dark the picture is, 0-80, set in the panel. Francois found the first
  // version too heavy, so the default is lighter and the rest is his call.
  // The text keeps its own shading at the bottom-left either way, so turning
  // this right down never leaves the title unreadable.
  const raw = Number(hero.darkness);
  const darkness = Number.isFinite(raw) && hero.darkness !== '' && hero.darkness != null
    ? Math.min(80, Math.max(0, raw))
    : 25;

  // Which part of the picture survives the crop, 0 (top) to 100 (bottom).
  // Default 20: the festival photos have their faces in the upper third, and
  // centring cut the astronaut's face. Francois can move it in the panel.
  const rawFocus = Number(hero.focus);
  const focus =
    hero.focus !== '' && hero.focus != null && Number.isFinite(rawFocus)
      ? Math.min(100, Math.max(0, rawFocus))
      : 20;
  const objectPosition = `50% ${focus}%`;

  // Zoom + which side the zoom keeps. The festival photo's left edge has a
  // misspelt "OXYBEN SUPPLY" label; zooming 115% while keeping the RIGHT edge
  // fixed slides it out of frame. A plain left/right object-position cannot
  // do it: on a wide screen the photo is barely cropped sideways, so there is
  // nothing to slide. Both are sliders in the panel (Header tab).
  const num = (value, fallback, min, max) => {
    const n = Number(value);
    return value !== '' && value != null && Number.isFinite(n)
      ? Math.min(max, Math.max(min, n))
      : fallback;
  };
  const zoom = num(hero.zoom, 115, 100, 150);
  const slide = num(hero.focusX, 100, 0, 100);
  const mediaStyle = {
    objectPosition,
    transform: zoom > 100 ? `scale(${zoom / 100})` : undefined,
    transformOrigin: `${slide}% ${focus}%`,
  };

  // Both buttons are optional and both are edited in the panel. The second
  // one used to be fixed text pointing at /selection, so empty keeps that
  // wording and a lone dash removes the button.
  const typed = String(hero.button2 || '').trim();
  let second = typed === '-' ? '' : typed || 'Watch the selection';

  // The centred "Submit your film" button is the submission call. If one of
  // the row buttons was also pointed at the same submission link (Francois set
  // the second one that way on 7 Nov while looking for where to add it), it
  // is not shown twice.
  const cta = submitOf(hero);
  const same = (a, b) =>
    String(a || '').trim().replace(/\/+$/, '').toLowerCase() ===
    String(b || '').trim().replace(/\/+$/, '').toLowerCase();
  const firstIsSubmit = cta && same(hero.link, cta.link);
  if (cta && same(hero.link2, cta.link)) second = '';

  return (
    <header className='relative min-h-[82vh] md:min-h-[88vh] flex items-end overflow-hidden bg-black'>
      {bg &&
        (isVideo ? (
          <video
            src={bg}
            autoPlay
            muted
            loop
            playsInline
            className='absolute inset-0 w-full h-full object-cover'
            style={mediaStyle}
          />
        ) : (
          <img
            src={cdn(bg, 'f_auto,q_auto,w_2000')}
            alt={hero.alt || ''}
            className='absolute inset-0 w-full h-full object-cover'
            style={mediaStyle}
          />
        ))}

      <div className='absolute inset-0 bg-black' style={{ opacity: darkness / 100 }} />
      {/* Shade only where the words are: bottom and left. */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent' />
      <div className='absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent' />

      <Shell className='relative w-full pb-16 md:pb-20 text-white'>
        {/* The ONLY place the dates appear on the whole site. */}
        {hero.dateline && (
          <div
            className='text-[11px] sm:text-[11.5px] tracking-[0.4em] uppercase mb-5 [text-shadow:0_1px_8px_rgba(0,0,0,.6)]'
            style={{ color: GOLD }}
          >
            {hero.dateline}
          </div>
        )}
        <h1 className='font-serif text-[44px] sm:text-[62px] lg:text-[76px] leading-[1.02] font-normal max-w-[13ch] [text-shadow:0_2px_18px_rgba(0,0,0,.45)]'>
          {hero.title}
        </h1>
        {hero.description && (
          <p className='text-[15px] sm:text-base text-neutral-100 mt-5 max-w-[46ch] leading-[1.6] [text-shadow:0_1px_10px_rgba(0,0,0,.6)]'>
            {hero.description}
          </p>
        )}
        <div className='flex flex-wrap gap-3.5 mt-9'>
          {hero.button && !firstIsSubmit && (
            <Link
              href={hero.link || '/top-filmmakers'}
              {...outside(hero.link)}
              className='px-7 py-[15px] text-[11.5px] tracking-[0.17em] uppercase font-bold text-black'
              style={{ background: GOLD }}
            >
              {hero.button}
            </Link>
          )}
          {second && (
            <Link
              href={hero.link2 || '/selection'}
              {...outside(hero.link2)}
              className='px-7 py-[15px] text-[11.5px] tracking-[0.17em] uppercase border border-white/60 bg-black/25 backdrop-blur-[2px] hover:bg-white/10 transition-colors'
            >
              {second}
            </Link>
          )}
        </div>
        {/* Mobile: under the buttons. Desktop: centred at the bottom. */}
        <SubmitButton
          hero={hero}
          className='mt-6 w-full md:w-auto md:mt-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-5'
        />
      </Shell>
    </header>
  );
};

/* --------------------------------------------------------------- edition -- */

export const Edition = ({ edition }) => {
  if (!edition?.description && !edition?.schedule?.length) return null;

  return (
    <section className='waimf-band pt-10 lg:pt-14 pb-10 lg:pb-12'>
      {/* Less space above than other sections: this one sits straight under
          the hero, whose own bottom padding already separates them. Francois:
          "reduce the space between header and the start of first section". */}
      <Shell>
        <SectionHead eyebrow='Edition 2027' title={edition.title} />
        <div className='grid lg:grid-cols-[1.05fr_.95fr] gap-12 lg:gap-[72px] items-start'>
          <div className='text-[16px] leading-[1.78] text-neutral-700 whitespace-pre-line'>
            {edition.description}
          </div>
          {edition.schedule?.length > 0 && (
            <div>
              <div
                className='text-[10.5px] tracking-[0.34em] uppercase mb-5'
                style={{ color: GOLD }}
              >
                Festival schedule
              </div>
              <div className='border-t border-neutral-200'>
                {edition.schedule.map((row, i) => (
                  <div
                    key={i}
                    className='flex gap-5 py-4 border-b border-neutral-200 text-[15px] items-baseline'
                  >
                    <b
                      className='font-serif font-normal shrink-0 w-[124px]'
                      style={{ color: GOLD }}
                    >
                      {row.when}
                    </b>
                    <span>{row.what}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Shell>
    </section>
  );
};

/* --------------------------------------------------------------- winners -- */

// `bare` drops the eyebrow and heading, for a page that already carries its own
// PageHeader - otherwise /top-filmmakers reads "WINNERS / Top Filmmakers 2026"
// immediately followed by "WINNERS / ..." again.
export const Winners = ({ filmmakers, action, bare = false }) => {
  const items = filmmakers?.items || [];
  if (items.length === 0) return null;

  // Same look as the Festival Awards list - white, the same rows and type,
  // no numbers - Francois, 4 Nov (it was a dark band before).
  return (
    <section className={`waimf-band pb-10 lg:pb-12 ${bare ? 'pt-10 lg:pt-14' : 'pt-10 lg:pt-12'}`}>
      <Shell>
        {!bare && (
          <SectionHead
            eyebrow='Winners'
            title={filmmakers.mainTitle}
            sub={filmmakers.description}
            action={action}
          />
        )}

        <Intro text={filmmakers.intro} className={bare ? 'mb-10' : '-mt-6 mb-10'} />
        <ul className='grid md:grid-cols-2 gap-x-[70px]'>
          {items.map((row, i) => (
            <li
              key={i}
              className='border-t border-neutral-200 py-[21px] grid grid-cols-[132px_1fr] sm:grid-cols-[190px_1fr] gap-5 items-baseline'
            >
              <em
                className='not-italic text-[10.5px] tracking-[0.17em] uppercase'
                style={{ color: GOLD }}
              >
                {row.award}
              </em>
              <div>
                <b className='font-normal text-[17px] block'>{row.film}</b>
                {row.filmmaker && (
                  <span className='block text-[13.5px] text-neutral-500 mt-1'>
                    {row.filmmaker}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <WinnerVideos items={items} />
      </Shell>
    </section>
  );
};

// The winners' films, playing right on the page. Francois: "we shall be able to
// see the embedded films directly without the need to click on the button".
// Only rows with a YouTube address show, so the block grows as links are
// pasted in and is absent until the first one is. One film plays wide; two or
// more sit in a grid.
// A YouTube film that costs nothing until it is played: the poster frame and a
// play button, swapped for the real player (already playing) on click. Each
// live YouTube player pulls in about a megabyte of scripts, so twenty of them
// on Top Filmmakers made the page heavy - Francois, 21 Oct. Looks and behaves
// like the embed, minus the weight.
// YouTube's poster frames, sharpest first. hqdefault (480px) looked soft once
// stretched across a 600px tile on a retina screen - Francois, 22 Oct. Not
// every video has the 1280px one: YouTube then answers with a 120x90 grey
// placeholder, so a picture that narrow means "try the next size".
const POSTER_SIZES = ['maxresdefault', 'sddefault', 'hqdefault'];

export const LitePlayer = ({ id, title }) => {
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState(0);
  const nextPosterIfMissing = (e) => {
    const img = e.currentTarget;
    const missing = e.type === 'error' || img.naturalWidth <= 120;
    if (missing && poster < POSTER_SIZES.length - 1) setPoster(poster + 1);
  };
  return (
    <div className='relative w-full aspect-video bg-black overflow-hidden'>
      {playing ? (
        <iframe
          src={playerSrc(`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`)}
          title={title || 'WAIMF 2026'}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
          className='absolute inset-0 w-full h-full'
        />
      ) : (
        <button
          type='button'
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title || 'film'}`}
          className='group absolute inset-0 w-full h-full'
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/${POSTER_SIZES[poster]}.jpg`}
            alt=''
            loading='lazy'
            onLoad={nextPosterIfMissing}
            onError={nextPosterIfMissing}
            className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]'
          />
          <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[68px] h-[68px] rounded-full border border-white/90 bg-black/35 backdrop-blur-[2px] shadow-[0_2px_14px_rgba(0,0,0,.35)] flex items-center justify-center group-hover:scale-105 transition-transform'>
            <svg viewBox='0 0 24 24' className='w-7 h-7 ml-1' fill={GOLD} aria-hidden='true'>
              <path d='M7 4.5v15l13-7.5z' />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

// The winners' films, under the winners list. Ten at first, then "See more"
// adds ten at a time, so a long list of winners never loads at once.
const WINNER_PAGE = 10;

const WinnerVideos = ({ items }) => {
  const [shown, setShown] = useState(WINNER_PAGE);
  const films = (items || [])
    .map((row) => ({ ...row, id: youtubeId(row.youtubeUrl) }))
    .filter((row) => row.id);
  if (films.length === 0) return null;
  const visible = films.slice(0, shown);
  const left = films.length - visible.length;

  return (
    <div className='mt-14 lg:mt-16'>
      <div
        className={`grid gap-x-8 gap-y-12 ${
          films.length === 1 ? 'max-w-[980px]' : 'md:grid-cols-2'
        }`}
      >
        {visible.map((film, i) => (
          <figure key={`${film.id}-${i}`}>
            <LitePlayer id={film.id} title={film.film || film.award} />
            <figcaption className='mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1'>
              <em
                className='not-italic text-[10.5px] tracking-[0.17em] uppercase'
                style={{ color: GOLD }}
              >
                {film.award}
              </em>
              <span className='font-serif text-[18px]'>{film.film}</span>
              {film.filmmaker && (
                <span className='text-[13.5px] text-neutral-500'>{film.filmmaker}</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      {left > 0 && (
        <div className='mt-12 flex justify-center'>
          <button
            type='button'
            onClick={() => setShown((n) => n + WINNER_PAGE)}
            className='rounded-full px-8 py-3.5 text-[11px] tracking-[0.17em] uppercase border border-neutral-300 hover:border-neutral-500 transition-colors'
            style={{ color: GOLD }}
          >
            See more films ({left})
          </button>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------- selection -- */

// Selection, Gallery and Rules each take `bare`: on their own pages the dark
// PageHeader already carries the title, and printing it again on the section
// underneath is the "WAIMF RULES & TERMS" twice Francois spotted.

// Titles only, no pictures: the selection runs to well over a hundred films
// and nobody has posters for them. Francois: "the list shall appear without
// images". Two lists, Finalists then the Official Selection, in the order they
// were pasted. A film with a YouTube address gets its title linked.
const FilmList = ({ heading, films: listed, gold = false, intro = '' }) => {
  // The same title twice in one list is always a paste on top of a paste, never
  // two films, so each title shows once. Compared on letters and digits only:
  // "Sofisma - Rara", "Sofisma Rara" and the old split "Sofisma" + "Rara" are
  // one film. Of the copies, the one typed as a single title wins (the split
  // ones came from the old paste box), at the place the first copy was.
  const norm = (film) =>
    `${film.title || ''} ${film.director || ''}`.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
  const best = new Map();
  for (const film of listed) {
    const k = norm(film);
    const had = best.get(k);
    if (!had || (had.director && !film.director)) best.set(k, film);
  }
  const shown = new Set();
  const films = [];
  for (const film of listed) {
    const k = norm(film);
    if (shown.has(k)) continue;
    shown.add(k);
    films.push(best.get(k));
  }
  if (films.length === 0) return null;
  return (
    <div className='mb-16 last:mb-0'>
      <h3
        className='font-serif text-[30px] sm:text-[36px] lg:text-[40px] leading-[1.1] uppercase tracking-[0.06em] mb-6'
        style={{ color: gold ? GOLD : '#111' }}
      >
        {heading}
      </h3>
      <Intro text={intro} />
      {/* Rows in the Festival Awards style - same rule lines, same type, no
          numbers - Francois, 4 Nov. Columns read top to bottom. */}
      <ul className='columns-1 md:columns-2 lg:columns-3 gap-x-[56px]'>
        {films.map((film, i) => (
          <li key={i} className='break-inside-avoid border-t border-neutral-200 py-[16px]'>
            {film.youtubeUrl ? (
              <a
                href={film.youtubeUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='font-normal text-[17px] leading-snug hover:underline'
              >
                {film.title}
                <span className='ml-2 text-[11px] align-middle' style={{ color: GOLD }}>&#9654;</span>
              </a>
            ) : (
              <b className='font-normal text-[17px] leading-snug'>{film.title}</b>
            )}
            {(film.director || film.duration) && (
              <span className='block text-[13px] text-neutral-500 mt-1'>
                {[film.director, film.duration].filter(Boolean).join('  ·  ')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// A row of YouTube films with an optional heading, set in the panel under
// Official Selection ("Videos above / below the Official Selection list").
// Renders nothing until at least one address is a real YouTube link.
const VideoBlock = ({ block }) => {
  const ids = (block?.urls || []).map(youtubeId).filter(Boolean);
  if (ids.length === 0) return null;
  return (
    <div className='my-16'>
      {(block.title || '').trim() && (
        <h3 className='font-serif text-[26px] sm:text-[30px] leading-[1.15] mb-7'>
          {block.title}
        </h3>
      )}
      <div className={`grid gap-8 ${ids.length === 1 ? 'max-w-[980px]' : 'md:grid-cols-2'}`}>
        {ids.map((id, i) => (
          <LitePlayer key={`${id}-${i}`} id={id} title={block.title} />
        ))}
      </div>
    </div>
  );
};

// `finalistsOnly` is for the front page: the full selection is a long page of
// its own, so the front shows the finalists and links through to the rest.
export const Selection = ({ selection, action, bare = false, finalistsOnly = false }) => {
  const items = (selection?.items || []).filter((film) => (film.title || '').trim());
  if (items.length === 0) return null;

  const finalists = items.filter((film) => (film.category || '').trim());
  const official = items.filter((film) => !(film.category || '').trim());
  if (finalistsOnly && finalists.length === 0) return null;

  return (
    <section className='waimf-band py-10 lg:py-12'>
      <Shell>
        {!bare && (
          <SectionHead
            eyebrow='Official Selection'
            title={selection.mainTitle}
            sub={selection.description}
            action={action}
          />
        )}
        <FilmList heading='Finalists' films={finalists} gold intro={selection.finalistsIntro} />
        {!finalistsOnly && (
          <>
            <VideoBlock block={selection.videosAbove} />
            <FilmList heading='Official Selection' films={official} intro={selection.officialIntro} />
            <VideoBlock block={selection.videosBelow} />
          </>
        )}
      </Shell>
    </section>
  );
};

/* ---------------------------------------------------------------- awards -- */

export const Awards = ({ awards }) => {
  const cards = awards?.cards || [];
  if (cards.length === 0) return null;

  return (
    <section className='waimf-band py-10 lg:py-12'>
      <Shell>
        <SectionHead
          eyebrow='Awards'
          title={awards.mainTitle}
          sub={awards.description}
        />
        {/* Numbered down the first column, then the second (01-06 left,
            07-11 right) - across-then-down read 01, 02 side by side, which
            Francois found illogical (4 Nov). */}
        <ul
          className='grid md:grid-cols-2 md:grid-flow-col gap-x-[70px]'
          style={{ gridTemplateRows: `repeat(${Math.ceil(cards.length / 2)}, auto)` }}
        >
          {cards.map((card, i) => (
            <li
              key={i}
              className='border-t border-neutral-200 py-[21px] flex gap-4 items-baseline'
            >
              <i
                className='not-italic font-serif text-[14px] w-7 shrink-0'
                style={{ color: GOLD }}
              >
                {String(i + 1).padStart(2, '0')}
              </i>
              <b className='font-normal text-[17px]'>{card.title}</b>
            </li>
          ))}
        </ul>
      </Shell>
    </section>
  );
};

/* ------------------------------------------------------------------ jury -- */

/* ------------------------------------------------------------ latest news -- */

// The three newest articles, for the front page above the jury. Covers are
// 16:9 with text on them, so they are shown whole in a 16:9 frame - a 16:10
// crop centred on the face cut the words off the right (Francois, 3 Nov).
// Sorted by the date printed on the article (the one Francois types), falling
// back to when it was created, so a back-dated import cannot jump to the top.
// Links use the same slug rule as the News page and the sitemap.
const articleTime = (article) => {
  const shown = Date.parse(article?.date || '');
  return Number.isFinite(shown) ? shown : Date.parse(article?.createdAt || '') || 0;
};

// `skip` lets the page show the newest three right under the edition text
// and the next three further down (Francois, 4 Nov) from one sorted list.
export const LatestNews = ({ articles, action, count = 3, skip = 0, eyebrow = 'Latest', title = 'WAIMF NEWS' }) => {
  const latest = [...(articles || [])]
    .filter((a) => (a?.title || '').trim())
    .sort((a, b) => articleTime(b) - articleTime(a))
    .slice(skip, skip + count);
  if (latest.length === 0) return null;

  return (
    <section className='waimf-band py-10 lg:py-12 bg-neutral-50'>
      <Shell>
        <SectionHead eyebrow={eyebrow} title={title} action={action} />
        <div className='grid md:grid-cols-3 gap-8 lg:gap-[34px]'>
          {latest.map((article) => (
            <Link
              key={article._id || article.title}
              href={`/news/${slugify(article.title, { lower: true, strict: true })}`}
              className='group block bg-white'
            >
              <div className='overflow-hidden bg-neutral-200'>
                {article.image && (
                  <img
                    src={cdn(article.image, 'f_auto,q_auto,w_900')}
                    alt={article.alt || article.title}
                    loading='lazy'
                    className='w-full aspect-video object-cover transition-opacity duration-300 group-hover:opacity-90'
                  />
                )}
              </div>
              <div className='p-6'>
                {article.date && (
                  <div className='text-[10.5px] tracking-[0.28em] uppercase mb-3' style={{ color: GOLD }}>
                    {article.date}
                  </div>
                )}
                <h3 className='font-serif text-[20px] leading-[1.3] group-hover:underline underline-offset-4'>
                  {article.title}
                </h3>
                <span className='inline-block mt-4 text-[11.5px] tracking-[0.17em] uppercase text-neutral-500'>
                  Read more
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Shell>
    </section>
  );
};

export const Jury = ({ jurors, action }) => {
  const items = jurors?.items || [];
  if (items.length === 0) return null;

  return (
    <section className='waimf-band py-10 lg:py-12'>
      <Shell>
        <SectionHead
          eyebrow='The jury'
          title={jurors.mainTitle}
          sub='Producers, directors, distributors and AI artists who judged the 2026 selection.'
          action={action}
        />
        <Intro text={jurors.intro} className='-mt-6 mb-10' />
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-[34px]'>
          {items.map((juror, i) => (
            <figure key={i}>
              {juror.image && (
                <img
                  src={portrait(juror.image)}
                  alt={juror.name || ''}
                  loading='lazy'
                  className='w-full aspect-square object-cover grayscale contrast-[1.04]'
                />
              )}
              <b className='block text-[14.5px] mt-4 font-semibold leading-[1.35]'>
                {juror.name}
              </b>
              {juror.role && (
                <span className='block text-[12.5px] text-neutral-500 mt-1.5 leading-[1.5]'>
                  {juror.role}
                </span>
              )}
            </figure>
          ))}
        </div>
      </Shell>
    </section>
  );
};

/* --------------------------------------------------------------- gallery -- */

export const Gallery = ({ gallery, action, placeholders = 0, bare = false }) => {
  const images = gallery?.images || [];
  // With no photographs and no placeholders asked for, the section is absent
  // rather than an empty grid.
  if (images.length === 0 && placeholders === 0) return null;

  return (
    <section className='waimf-band py-10 lg:py-12'>
      <Shell>
        {!bare && (
          <SectionHead
          eyebrow='Gallery'
          title={gallery?.mainTitle || 'Gallery'}
          sub={
            images.length === 0
              ? 'Photographs from the two days in Marbella. Upload them in the panel and this grid fills itself.'
              : undefined
          }
          action={action}
        />
        )}
        <Intro text={gallery?.intro} className={bare ? 'mb-10' : '-mt-6 mb-10'} />
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3.5'>
          {images.length > 0
            ? images.map((src, i) => (
                <img
                  key={i}
                  src={tile(src)}
                  alt=''
                  loading='lazy'
                  className='w-full aspect-[4/3] object-cover'
                />
              ))
            : Array.from({ length: placeholders }).map((_, i) => (
                <div
                  key={i}
                  className='aspect-[4/3] bg-neutral-100 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-[11px] tracking-[0.16em] uppercase'
                >
                  Photo
                </div>
              ))}
        </div>
      </Shell>
    </section>
  );
};

/* ----------------------------------------------------------------- rules -- */

export const Rules = ({ rules, limit, bare = false }) => {
  const items = rules?.items || [];
  if (items.length === 0) return null;
  const shown = limit ? items.slice(0, limit) : items;

  return (
    <section className='waimf-band py-10 lg:py-12'>
      <Shell>
        {!bare && (
          <SectionHead
          eyebrow='Rules'
          title={rules.mainTitle || 'Rules'}
          sub={rules.subtitle}
          action={limit ? <Pill href='/rules'>Read in full</Pill> : null}
        />
        )}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-[46px]'>
          {shown.map((item, i) => (
            <div key={i}>
              <h3 className='font-serif text-[19px] font-normal pb-3.5 border-b border-neutral-200 mb-4'>
                {item.term}
              </h3>
              <p className='text-[14px] leading-[1.75] text-neutral-700 whitespace-pre-line'>
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
};

/* --------------------------------------------------------------- contact -- */

export const ContactBand = ({ contact }) => {
  if (!contact?.mainTitle) return null;
  return (
    <div className='bg-[#0a0a0a] text-white py-20 lg:py-24'>
      <Shell>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-[72px] items-end'>
          <div>
            <div
              className='text-[10.5px] tracking-[0.34em] uppercase mb-4'
              style={{ color: GOLD }}
            >
              Contact
            </div>
            <h2 className='font-serif text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.08]'>
              {contact.mainTitle}
            </h2>
            {contact.description && (
              <p className='text-[15.5px] leading-[1.72] text-neutral-400 mt-4'>
                {contact.description}
              </p>
            )}
          </div>
          <Link
            href='/contact'
            className='justify-self-start lg:justify-self-end px-8 py-[15px] text-[11.5px] tracking-[0.17em] uppercase font-bold text-black'
            style={{ background: GOLD }}
          >
            {contact.buttonText || 'Get in touch'}
          </Link>
        </div>
      </Shell>
    </div>
  );
};

/* -------------------------------------------------- page-level furniture -- */

// Every inner page opens with this instead of the full hero, so the sticky
// white-on-transparent navbar always has something dark behind it. Without it
// the menu would be white type on a white page.
export const PageHeader = ({ eyebrow, title, sub, submit }) => (
  <header className='bg-[#0a0a0a] text-white pt-32 pb-16 lg:pt-40 lg:pb-20'>
    <Shell>
      {showEyebrow(eyebrow, title) && (
        <div
          className='text-[10.5px] tracking-[0.34em] uppercase mb-4'
          style={{ color: GOLD }}
        >
          {showEyebrow(eyebrow, title)}
        </div>
      )}
      <h1 className='font-serif text-[36px] sm:text-[52px] lg:text-[62px] leading-[1.04] font-normal max-w-[16ch]'>
        {title}
      </h1>
      {sub && (
        <p className='text-[15.5px] leading-[1.7] text-neutral-400 mt-5 max-w-[60ch]'>
          {sub}
        </p>
      )}
      {submit && <SubmitButton hero={submit} className='mt-8' />}
    </Shell>
  </header>
);
