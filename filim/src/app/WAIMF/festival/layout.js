// Server-side metadata for /WAIMF/festival. The page itself is a client
// component, so it cannot export metadata - this thin layout does it and
// renders the page unchanged. Copy comes from the CMS (/api/getmetadata).
import { pageMetadata } from '@/utils/siteMeta';
import { JsonLd, festivalEventSchema } from '@/utils/structuredData';

export async function generateMetadata() {
  return pageMetadata('festival', '/WAIMF/festival');
}

export default function Layout({ children }) {
  return (
    <>
      {/* Dates, venue and submissions, in the form Google can show as an
          event rich result rather than having to infer from the page text. */}
      <JsonLd schemas={[festivalEventSchema()]} />
      {children}
    </>
  );
}
