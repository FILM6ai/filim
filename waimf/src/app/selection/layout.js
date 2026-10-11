import { pageMetadata } from '@/utils/siteMeta';

export async function generateMetadata() {
  return pageMetadata('selection', '/selection');
}

export default function Layout({ children }) {
  return children;
}
