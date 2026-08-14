// Per-article metadata for /news/<slug>.
//
// The article page is a client component, so it cannot export metadata itself.
// This layout looks the article up by the same slug the listing pages link
// with, and gives each of the news posts its own title, description, canonical
// URL and social preview image instead of all of them sharing one generic set.
import slugify from 'slugify';
import { API_BASE_URL } from '@/utils/backend';
import { buildMetadata, htmlToDescription, pageMetadata } from '@/utils/siteMeta';
import { JsonLd, articleSchema, publishedDate } from '@/utils/structuredData';

// Must match the links in BlogsNews / Blogs / the article page itself.
const toSlug = (title) => slugify(title || '', { lower: true, strict: true });

const fetchBlogs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/blog/getblog`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.blogs) ? json.blogs : [];
  } catch {
    return [];
  }
};

export async function generateMetadata({ params }) {
  const { title } = await params;
  const slug = decodeURIComponent(title || '');

  const blogs = await fetchBlogs();
  const article = blogs.find((blog) => toSlug(blog?.title) === slug);

  // Unknown slug (or the backend is down): fall back to the news section's
  // metadata rather than shipping a page with no title at all.
  if (!article) return pageMetadata('blog', `/news/${slug}`);

  const name = String(article.title || '').trim();

  return buildMetadata({
    title: `${name} | FILM6 News`,
    description:
      htmlToDescription(article.content, { stripPrefix: name }) ||
      `${name} - news from FILM6 and the World AI Movie Festival.`,
    path: `/news/${slug}`,
    image: typeof article.image === 'string' ? article.image : undefined,
    type: 'article',
    publishedTime: publishedDate(article.date, article.createdAt),
  });
}

export default async function Layout({ children, params }) {
  const { title } = await params;
  const slug = decodeURIComponent(title || '');

  // Same fetch as generateMetadata above, so Next serves it from its request
  // cache rather than calling the backend a second time.
  const blogs = await fetchBlogs();
  const article = blogs.find((blog) => toSlug(blog?.title) === slug);

  const name = String(article?.title || '').trim();

  return (
    <>
      {article && (
        <JsonLd
          schemas={[
            articleSchema({
              title: name,
              description: htmlToDescription(article.content, {
                stripPrefix: name,
              }),
              slug,
              image: typeof article.image === 'string' ? article.image : null,
              datePublished: publishedDate(article.date, article.createdAt),
              dateModified: article.updatedAt,
              author: article.author,
            }),
          ]}
        />
      )}
      {children}
    </>
  );
}
