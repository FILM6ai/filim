// Structured data (JSON-LD) for search engines.
//
// This is the machine-readable version of what a page says: it lets Google
// understand "this is a film festival, on these dates, in this place" rather
// than guessing from prose, which is what earns a rich result instead of a
// plain blue link.
//
// Everything here is taken from copy already published on the site or from the
// CMS - nothing is invented. Wrong structured data is worse than none, so if a
// fact below stops being true it must be corrected here too.

import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from './siteMeta';

const LOGO =
  'https://res.cloudinary.com/dzzjfgy5v/image/upload/v1742803950/xsq6akzvt4sbz4bkbkim.png';

// Official channels, as listed in the site footer.
const SOCIAL_PROFILES = [
  'https://www.youtube.com/@FILM6ai',
  'https://www.instagram.com/film.6ai/',
  'https://www.tiktok.com/@film6ai',
  'https://x.com/film6ai',
];

// WAIMF edition details, as stated on the festival page itself.
// UPDATE THESE when the edition changes - dates in structured data must match
// what a visitor actually sees on the page.
const FESTIVAL = {
  name: 'WAIMF - World AI Movie Festival',
  startDate: '2026-10-07',
  endDate: '2026-10-08',
  venue: 'Puerto Banús',
  city: 'Marbella',
  region: 'Andalusia',
  country: 'ES',
  submissionsUrl: 'https://filmfreeway.com/WAIMF',
};

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: 'FILM6.ai',
  url: SITE_URL,
  logo: LOGO,
  description:
    'FILM6 is an open-source AI movie studio and production company building a Cinematic Metaverse and sponsoring the World AI Movie Festival (WAIMF).',
  sameAs: SOCIAL_PROFILES,
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': ORGANIZATION_ID },
});

export const festivalEventSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Festival',
  name: FESTIVAL.name,
  alternateName: 'WAIMF',
  url: `${SITE_URL}/WAIMF/festival`,
  startDate: FESTIVAL.startDate,
  endDate: FESTIVAL.endDate,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  description:
    'The World AI Movie Festival celebrates films made with artificial intelligence, with an international jury, competitive categories and awards. The inaugural edition takes place in Puerto Banús, Marbella, Spain.',
  image: [DEFAULT_OG_IMAGE],
  location: {
    '@type': 'Place',
    name: `${FESTIVAL.venue}, ${FESTIVAL.city}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: FESTIVAL.city,
      addressRegion: FESTIVAL.region,
      addressCountry: FESTIVAL.country,
    },
  },
  organizer: { '@id': ORGANIZATION_ID },
  offers: {
    '@type': 'Offer',
    name: 'Film submission',
    url: FESTIVAL.submissionsUrl,
    availability: 'https://schema.org/InStock',
  },
});

/**
 * The date shown on an article is the editorial `date` field ("November 25,
 * 2025"), which is often much older than the CMS record's createdAt. Structured
 * data has to agree with what the visitor sees, so that field wins and the
 * record timestamp is only a fallback.
 */
export const publishedDate = (displayDate, createdAt) => {
  const parsed = Date.parse(String(displayDate || '').trim());
  return Number.isNaN(parsed)
    ? createdAt || undefined
    : new Date(parsed).toISOString();
};

export const articleSchema = ({
  title,
  description,
  slug,
  image,
  datePublished,
  dateModified,
  author,
}) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: title,
  description,
  url: `${SITE_URL}/news/${slug}`,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/news/${slug}`,
  },
  image: image ? [image] : [DEFAULT_OG_IMAGE],
  ...(datePublished ? { datePublished } : {}),
  ...(dateModified ? { dateModified } : {}),
  author: author
    ? { '@type': 'Organization', name: author }
    : { '@id': ORGANIZATION_ID },
  publisher: { '@id': ORGANIZATION_ID },
});

/**
 * Renders one or more schema objects into the page.
 *
 * Only ever called from server components, so the JSON is in the HTML the
 * crawler receives rather than something it has to run JavaScript to find.
 */
export const JsonLd = ({ schemas }) => (
  <>
    {schemas.filter(Boolean).map((schema, index) => (
      <script
        key={index}
        type='application/ld+json'
        // Content is built from our own objects, never from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    ))}
  </>
);
