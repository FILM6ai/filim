/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://film6.ai/',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
};
