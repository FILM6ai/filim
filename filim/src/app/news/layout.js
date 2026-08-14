// Server-side metadata for /news. The page itself is a client component,
// so it cannot export metadata - this thin layout does it and renders the page
// unchanged. Copy comes from the CMS (/api/getmetadata).
import { pageMetadata } from '@/utils/siteMeta';

export async function generateMetadata() {
  return pageMetadata('news', '/news');
}

export default function Layout({ children }) {
  return children;
}
