// Page metadata (title, description, canonical, social cards) for the website.
//
// The previous implementation used `next/head` inside "use client" pages. That
// is the Pages Router API and it is silently ignored by the App Router, so
// every page on the site shipped with no <title> and no meta description at
// all. Search engines had nothing to show and invented their own titles.
//
// The App Router only accepts metadata from a *server* component, and every
// page here is a client component, so each route gets a thin server-side
// layout that calls `pageMetadata()` and simply renders its children.
//
// Copy still lives in the CMS (/api/getmetadata) exactly as before - this just
// makes it reach the HTML. If the backend is unreachable at render time the
// baked-in fallbacks below are used, because a page with a slightly stale
// title is far better than a page with no title.

import { API_BASE_URL } from './backend';

export const SITE_URL = 'https://www.film6.ai';
export const SITE_NAME = 'FILM6';

// Cloudinary renders a still frame of the site header video on demand, so the
// social preview image needs no separate asset to keep in sync.
export const DEFAULT_OG_IMAGE =
  'https://res.cloudinary.com/rgwnsnby/video/upload/so_0,w_1200,h_630,c_fill,q_auto/site-headers/header_home_4k.jpg';

// Keys match the CMS metadata document. `page` is the route each one covers.
const FALLBACKS = {
  home: {
    title: 'FILM6 - Next-Gen AI Movie Studio',
    description:
      'FILM6 is a next-generation film studio powered by AI, and the home of WAIMF, the World AI Movie Festival.',
  },
  studio: {
    title: 'FILM6 AI Movie Studio',
    description:
      'The FILM6 studio: AI-driven development, production and post for a new wave of filmmakers.',
  },
  services: {
    title: 'FILM6 AI Production',
    description:
      'AI film production services from FILM6 - concept, generation, editing and delivery.',
  },
  festival: {
    title: 'WAIMF - World AI Movie Festival',
    description:
      'The World AI Movie Festival: awards, jury, rules and submissions for AI-made films.',
  },
  news: {
    title: 'FILM6 News',
    description:
      'News and analysis on AI filmmaking, generative video models and the World AI Movie Festival.',
  },
  blog: {
    title: 'FILM6 News',
    description:
      'News and analysis on AI filmmaking, generative video models and the World AI Movie Festival.',
  },
  contact: {
    title: 'Contact FILM6',
    description: 'Get in touch with the FILM6 team.',
  },
  faq: {
    title: 'FILM6 FAQ',
    description:
      'Frequently asked questions about FILM6 and the World AI Movie Festival.',
  },
  terms: {
    title: 'FILM6 Terms & Privacy',
    description: 'Terms of use and privacy policy for FILM6.',
  },
};

// Re-fetched at most every 5 minutes, so a CMS edit shows up quickly without
// every page view hitting the backend.
const REVALIDATE_SECONDS = 300;

const fetchCmsMetadata = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/getmetadata`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.[0] || null;
  } catch {
    return null;
  }
};

const clean = (value) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';

// Article bodies are Quill HTML. Strip it back to a plain sentence for the
// search snippet and the social card.
export const htmlToDescription = (html, { limit = 160, stripPrefix = '' } = {}) => {
  let text = clean(
    String(html || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>'),
  );

  // Most articles open by repeating their own headline, which would waste the
  // whole snippet saying what the title already says.
  const prefix = clean(stripPrefix);
  if (prefix && text.toLowerCase().startsWith(prefix.toLowerCase())) {
    text = clean(text.slice(prefix.length).replace(/^[\s\-–—:.,]+/, ''));
  }

  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}...`;
};

/**
 * Build a Next.js metadata object for a page.
 *
 * @param {string} key   key in the CMS metadata document (home, studio, ...)
 * @param {string} path  route path, used for the canonical URL ('/' for home)
 */
export const pageMetadata = async (key, path) => {
  const cms = await fetchCmsMetadata();
  const fallback = FALLBACKS[key] || FALLBACKS.home;

  const title = clean(cms?.[key]?.title) || fallback.title;
  const description = clean(cms?.[key]?.description) || fallback.description;

  return buildMetadata({ title, description, path });
};

/**
 * Shared shape for every page: canonical URL plus OpenGraph and Twitter cards
 * so shared links render a title, description and image instead of a bare URL.
 */
// Article images are whatever shape the editor uploaded. Social cards want
// 1200x630, so Cloudinary is asked to crop one - otherwise the declared
// dimensions would be a lie and previews would come out badly cropped.
const toSocialImage = (url) => {
  const match = String(url || '').match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/,
  );
  return match
    ? `${match[1]}c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/${match[2]}`
    : null;
};

export const buildMetadata = ({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  publishedTime,
}) => {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  const social = image ? toSocialImage(image) : DEFAULT_OG_IMAGE;
  // An image that isn't on Cloudinary can't be resized, so it is used as-is
  // and its dimensions are left undeclared rather than guessed.
  const ogImage = social
    ? { url: social, width: 1200, height: 630, alt: title }
    : { url: image, alt: title };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [ogImage],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
  };
};

export default pageMetadata;
