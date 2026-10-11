'use client';

import Loading from '@/components/faq/Loading';
import { PageHeader, Winners, WinningFilms, Awards } from '@/components/Waimf/Sections';
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
      {/* The winning films themselves. Francois moved the videos here so the
          selection page carries the finalists instead of everything at once. */}
      <WinningFilms filmmakers={data?.filmmakers} />
      <Awards awards={data?.awards} />
    </div>
  );
}
