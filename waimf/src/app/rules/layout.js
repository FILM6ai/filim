import { pageMetadata } from '@/utils/siteMeta';

export async function generateMetadata() {
  return pageMetadata('rules', '/rules');
}

export default function Layout({ children }) {
  return children;
}
