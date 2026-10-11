import { pageMetadata } from '@/utils/siteMeta';

export async function generateMetadata() {
  return pageMetadata('gallery', '/gallery');
}

export default function Layout({ children }) {
  return children;
}
