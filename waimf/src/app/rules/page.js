'use client';

import Loading from '@/components/faq/Loading';
import { PageHeader, Rules } from '@/components/Waimf/Sections';
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
      />
      <Rules rules={data?.rules} bare />
    </div>
  );
}
