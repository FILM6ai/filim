'use client';

import Loading from '@/components/faq/Loading';
import { PageHeader, Selection, Jury } from '@/components/Waimf/Sections';
import { useWaimf } from '@/components/Waimf/usePage';
import { Shell } from '@/components/Waimf/Sections';

// Every film in the Official Selection. Empty until the films are added in the
// panel, so it says so plainly rather than showing a bare heading.
export default function SelectionPage() {
  const { data, loading } = useWaimf();
  if (loading) return <Loading />;

  const empty = (data?.selection?.items || []).length === 0;

  return (
    <div>
      <PageHeader
        eyebrow='Official Selection'
        title={data?.selection?.mainTitle || 'Official Selection'}
        sub={data?.selection?.description}
      />
      {empty ? (
        <section className='py-20 lg:py-28'>
          <Shell>
            <p className='text-neutral-500'>
              The finalists and the official selection are being added. Check
              back shortly.
            </p>
          </Shell>
        </section>
      ) : (
        <Selection selection={data.selection} />
      )}
      <Jury jurors={data?.jurors} />
    </div>
  );
}
