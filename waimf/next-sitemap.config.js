/** @type {import('next-sitemap').IConfig} */

const slugify = require('slugify');

// Must be the host that actually answers, not a host that redirects to it:
// every URL Google fetches from a sitemap of redirects gets filed as "Page
// with redirect" instead of being indexed. CHECK which of waimf.org and
// www.waimf.org is canonical once DNS is pointed, and make this match.
// Hardcoded rather than read from an env var so a missing or stale Vercel
// variable cannot quietly break indexing.
const SITE_URL = 'https://waimf.org';

const rawApi = (
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://waimf-backend.vercel.app/api'
)
  .trim()
  .replace(/\/+$/, '');
const API_BASE_URL = /\/api$/i.test(rawApi) ? rawApi : `${rawApi}/api`;

// Same options the site uses when it renders /news links, so the sitemap can
// never point at a slug the site doesn't actually serve.
const toSlug = (title) => slugify(String(title || ''), { lower: true, strict: true });

const STATIC_ROUTES = {
  '/': { priority: 1.0, changefreq: 'weekly' },
  '/top-filmmakers': { priority: 0.9, changefreq: 'weekly' },
  '/selection': { priority: 0.9, changefreq: 'weekly' },
  '/news': { priority: 0.8, changefreq: 'daily' },
  '/rules': { priority: 0.7, changefreq: 'monthly' },
  '/gallery': { priority: 0.6, changefreq: 'weekly' },
  '/contact': { priority: 0.5, changefreq: 'monthly' },
  '/terms': { priority: 0.3, changefreq: 'yearly' },
};

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  trailingSlash: false,
  // /news/[title] is dynamic, so next-sitemap can't discover the articles on
  // its own - they're added by additionalPaths below.
  exclude: ['/news/[title]'],

  transform: async (config, path) => {
    const { priority = 0.7, changefreq = 'weekly' } = STATIC_ROUTES[path] || {};
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },

  // All news articles, pulled from the CMS at build time. Without this the
  // sitemap listed 8 pages out of 29 and no article was ever submitted.
  additionalPaths: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/blog/getblog`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const blogs = Array.isArray(json?.blogs) ? json.blogs : [];

      const seen = new Set();
      const paths = [];

      for (const blog of blogs) {
        const slug = toSlug(blog?.title);
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);

        paths.push({
          loc: `/news/${slug}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: new Date(
            blog?.updatedAt || blog?.createdAt || Date.now(),
          ).toISOString(),
        });
      }

      console.log(`[next-sitemap] added ${paths.length} news articles`);
      return paths;
    } catch (error) {
      // A sitemap missing the articles is bad, but a failed build is worse.
      console.warn(
        `[next-sitemap] could not load news articles: ${error.message}`,
      );
      return [];
    }
  },

  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
