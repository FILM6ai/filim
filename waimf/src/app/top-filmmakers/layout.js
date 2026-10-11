import { pageMetadata } from '@/utils/siteMeta';

export async function generateMetadata() {
  return pageMetadata('filmmakers', '/top-filmmakers');
}

export default function Layout({ children }) {
  return children;
}
