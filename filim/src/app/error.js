'use client';

import ErrorPanel from '@/components/ErrorPanel';

// Catches a render-time exception in any route. The root layout survives, so
// the visitor keeps the nav and footer and can carry on to another page
// instead of being dropped on a blank white screen.
export default function Error({ error, reset }) {
  return <ErrorPanel error={error} reset={reset} />;
}
