'use client';

import ErrorPanel from '@/components/ErrorPanel';
import './globals.css';

// Last resort: the root layout itself failed, so this has to supply <html> and
// <body>. Without it Next renders its own bare English "Application error"
// message, which is what a visitor saw before.
export default function GlobalError({ error, reset }) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <ErrorPanel error={error} reset={reset} standalone />
      </body>
    </html>
  );
}
