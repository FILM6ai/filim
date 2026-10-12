'use client';

import { useEffect, useState } from 'react';
import Loading from '@/components/faq/Loading';
import {
  Hero,
  Edition,
  Winners,
  Selection,
  Awards,
  Jury,
  Gallery,
  Rules,
  ContactBand,
  Pill,
} from '@/components/Waimf/Sections';
import { fetchWaimf } from '@/utils/waimf';

// waimf.org front page = the 2026 edition.
//
// It carries a condensed version of every section, each one linking through to
// its own page. Sections render nothing when empty, so the page shortens itself
// rather than showing headings with nothing underneath.
export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaimf()
      .then(setData)
      .catch((error) => console.error('Error loading WAIMF:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <Hero hero={data?.hero} />
      <Edition edition={data?.edition} />
      <Winners
        filmmakers={data?.filmmakers}
        action={<Pill href='/top-filmmakers' dark>All winners</Pill>}
      />
      <Selection
        selection={data?.selection}
        action={<Pill href='/selection'>See all films</Pill>}
      />
      <Awards awards={data?.awards} />
      <Jury jurors={data?.jurors} />
      <Gallery
        gallery={data?.gallery}
        placeholders={8}
        action={<Pill href='/gallery'>All photographs</Pill>}
      />
      <Rules rules={data?.rules} limit={3} />
      <ContactBand contact={data?.contact} />
    </div>
  );
}
