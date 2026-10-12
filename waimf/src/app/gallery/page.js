'use client';

import Loading from '@/components/faq/Loading';
import { PageHeader, Gallery } from '@/components/Waimf/Sections';
import { useWaimf } from '@/components/Waimf/usePage';

export default function GalleryPage() {
  const { data, loading } = useWaimf();
  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        eyebrow='Gallery'
        title={data?.gallery?.mainTitle || 'Gallery'}
        sub='Photographs from the two days in Marbella.'
      />
      {/* 12 placeholders while there are no photographs, so the page shows its
          shape instead of being blank. They disappear the moment one is added. */}
      <Gallery gallery={data?.gallery} placeholders={12} bare />
    </div>
  );
}
