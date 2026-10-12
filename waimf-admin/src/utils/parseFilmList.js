// Turn a pasted list into films, one per line.
//
// Francois will paste the finalist and selection lists from wherever they live
// - a spreadsheet, an email, the FILM6 popup text - so this accepts the shapes
// those actually come in rather than one strict format:
//
//   Azul Cobalto<TAB>Tomas Pena<TAB>https://youtu.be/...      (spreadsheet columns)
//   'Azul Cobalto' by Tomas Pena                              (the winners' style)
//   Azul Cobalto - Tomas Pena - 4 min - https://youtube.com/watch?v=...
//   1. Azul Cobalto | Tomas Pena
//
// A YouTube link or a running time is picked out wherever it sits on the line.
// Whatever is left is title, then director. Blank lines and headings with no
// film on them are skipped, and every line that could not be read is RETURNED,
// not silently dropped.

const YT = /(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)[A-Za-z0-9_-]{11}[^\s,;|]*/i;
const DURATION = /\b(\d{1,3})\s*(min|mins|minutes|')\b|\b\d{1,2}:\d{2}(:\d{2})?\b/i;

// A line that is only a list heading, not a film.
const HEADING = /^(the\s+)?(official\s+)?(selection|selections|finalists?|winners?|films?|award\s+winners|list)(\s+20\d\d)?[:\s]*$/i;

const tidy = (s) =>
  String(s || '')
    .replace(/^[\s"'‘’“”«»]+|[\s"'‘’“”«»]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const parseFilmList = (text) => {
  const films = [];
  const skipped = [];

  for (const raw of String(text || '').split(/\r?\n/)) {
    let line = raw.trim();
    if (!line) continue;
    if (HEADING.test(line.replace(/[^\p{L}\p{N}\s]/gu, '').trim())) {
      skipped.push(raw.trim());
      continue;
    }

    // Leading numbering, bullets and emoji: "1.", "01 -", "•", "🏆".
    line = line.replace(/^[^\p{L}\p{N}'"‘“]+/u, '').replace(/^\d{1,3}[.)\-:]\s*/, '');

    let youtubeUrl = '';
    const yt = line.match(YT);
    if (yt) {
      youtubeUrl = yt[0].startsWith('http') ? yt[0] : `https://${yt[0]}`;
      line = line.replace(yt[0], ' ');
    }

    let duration = '';
    const d = line.match(DURATION);
    if (d) {
      duration = d[0].replace(/\s*(mins?|minutes|')$/i, ' min').trim();
      line = line.replace(d[0], ' ');
    }

    let title = '';
    let director = '';
    const quoted = line.match(/[‘'"“](.+?)[’'"”]\s*(?:by|par|de)?\s*(.*)$/i);
    const byForm = line.match(/^(.+?)\s+(?:by|par)\s+(.+)$/i);
    if (quoted) {
      title = quoted[1];
      director = quoted[2];
    } else if (byForm) {
      title = byForm[1];
      director = byForm[2];
    } else {
      // Columns: tab first (spreadsheet), then | ; and spaced dashes.
      const parts = line
        .split(/\t+|\s+\|\s+|\s*;\s*|\s+[-–—]\s+/)
        .map(tidy)
        .filter(Boolean);
      title = parts[0] || '';
      director = parts[1] || '';
    }

    title = tidy(title).replace(/[\s\-–—|,;:]+$/, '');
    director = tidy(director).replace(/^by\s+/i, '').replace(/[\s\-–—|,;:]+$/, '');

    if (!title) {
      skipped.push(raw.trim());
      continue;
    }
    films.push({ title, director, duration, youtubeUrl });
  }

  return { films, skipped };
};

export default parseFilmList;
