'use client';

import Loading from '@/components/faq/Loading';
import { PageHeader, Gallery } from '@/components/Waimf/Sections';
import { useWaimf } from '@/components/Waimf/usePage';

// Shown until a line is saved on the Gallery tab; saving it empty removes it.
const GALLERY_LINE = 'Photographs from the two days in Marbella.';

export default function GalleryPage() {
  const { data, loading } = useWaimf();
  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        eyebrow='Gallery'
        title={data?.gallery?.mainTitle || 'Gallery'}
        sub={data?.gallery?.description ?? GALLERY_LINE}
      />
      {/* 12 placeholders while there are no photographs, so the page shows its
          shape instead of being blank. They disappear the moment one is added. */}
      <Gallery gallery={data?.gallery} placeholders={12} bare />
    </div>
  );
}
