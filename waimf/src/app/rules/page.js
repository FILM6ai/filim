'use client';

import Loading from '@/components/faq/Loading';
import { PageHeader, Rules, Awards } from '@/components/Waimf/Sections';
import { useWaimf } from '@/components/Waimf/usePage';

// The full rules, terms and screening rights - no truncation here, this is the
// page a filmmaker is sent to before submitting.
export default function RulesPage() {
  const { data, loading } = useWaimf();
  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        eyebrow='Rules'
        title={data?.rules?.mainTitle || 'Rules'}
        sub={data?.rules?.subtitle}
        submit={data?.hero || {}}
        media={data?.rules?.headerMedia}
      />
      <Rules rules={data?.rules} bare />
      {/* The award categories, so a filmmaker reading the rules sees what can
          be won - Francois, 16 Nov. Same list as the front page. */}
      <Awards awards={data?.awards} />
    </div>
  );
}
