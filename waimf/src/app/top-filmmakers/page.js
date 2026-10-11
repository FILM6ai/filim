'use client';

import Loading from '@/components/faq/Loading';
import { PageHeader, Winners, Awards } from '@/components/Waimf/Sections';
import { useWaimf } from '@/components/Waimf/usePage';

// The award winners, in full, plus what each award is for.
export default function TopFilmmakers() {
  const { data, loading } = useWaimf();
  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        eyebrow='Winners'
        title='Top Filmmakers 2026'
        sub={data?.filmmakers?.description}
      />
      <Winners filmmakers={data?.filmmakers} bare />
      <Awards awards={data?.awards} />
    </div>
  );
}
