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
  LatestNews,
} from '@/components/Waimf/Sections';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/backend';
import { fetchWaimf } from '@/utils/waimf';

// waimf.org front page = the 2026 edition.
//
// It carries a condensed version of every section, each one linking through to
// its own page. Sections render nothing when empty, so the page shortens itself
// rather than showing headings with nothing underneath.
export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // The news block is extra: if the articles fail to load, the rest of the
    // page still shows, just without it.
    axios
      .get(`${API_BASE_URL}/blog/getblog`)
      .then(({ data }) => setArticles(Array.isArray(data?.blogs) ? data.blogs : []))
      .catch((error) => console.error('Error loading news:', error));

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
      {/* No "All winners" button: the winning films play right here. */}
      <Winners filmmakers={data?.filmmakers} />
      {/* Awards and Jury come before the films - Francois's order. */}
      <Awards awards={data?.awards} />
      {/* The three newest articles, just above the jury - Francois, 16 Oct. */}
      <LatestNews articles={articles} action={<Pill href='/news'>All news</Pill>} />
      <Jury jurors={data?.jurors} />
      <Selection
        selection={data?.selection}
        finalistsOnly
        action={<Pill href='/selection'>Full official selection</Pill>}
      />
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
