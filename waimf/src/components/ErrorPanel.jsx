'use client';

import { useEffect, useState } from 'react';

// A browser that loaded the page from an older build asks for JS chunks that
// no longer exist. React only sees "something threw", so match on the message.
// This only changes the wording — reloading stays the visitor's decision,
// because an automatic reload that lands on the same error becomes a loop.
const CHUNK_ERROR = /loading chunk|chunkloaderror|importing a module script failed|failed to fetch dynamically imported module|error loading dynamically imported module/i;

// Shared by the route boundary (error.js) and the last-resort one
// (global-error.js) so a visitor sees the same thing either way.
export default function ErrorPanel({ error, reset, standalone = false }) {
  const [details, setDetails] = useState(false);
  const stale = CHUNK_ERROR.test(error?.message || '');

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'exception', {
      description: `${error?.message || 'unknown'} | ${error?.digest || 'no-digest'} | ${window.location.pathname}`,
      fatal: true,
    });
  }, [error]);

  const wrap = standalone
    ? 'min-h-screen bg-black text-white flex items-center justify-center px-6'
    : 'min-h-[70vh] bg-black text-white flex items-center justify-center px-6 pt-28 pb-16';

  return (
    <div className={wrap}>
      <div className='w-full max-w-xl text-center'>
        <p className='text-sm tracking-[0.3em] text-gray-500 uppercase mb-4'>
          FILM6
        </p>
        <h1 className='text-3xl sm:text-4xl mb-4'>This page did not load</h1>
        <p className='text-gray-400 mb-8'>
          {stale
            ? 'The site was updated while this page was open, so your browser is holding an old copy. Reloading will fix it.'
            : 'Sorry — something went wrong displaying this page. Reloading usually fixes it.'}
        </p>

        <div className='flex flex-wrap gap-3 justify-center'>
            <button
              onClick={() => window.location.reload()}
              className='px-6 py-2 rounded-md bg-white text-black hover:bg-[#00a4c2] hover:text-white transition-all duration-300'
            >
              Reload the page
            </button>
            {typeof reset === 'function' && (
              <button
                onClick={reset}
                className='px-6 py-2 rounded-md border border-white hover:bg-[#00a4c2] transition-all duration-300'
              >
                Try again
              </button>
            )}
            <a
              href='/'
              className='px-6 py-2 rounded-md border border-white hover:bg-[#00a4c2] transition-all duration-300'
            >
              Back to home
          </a>
        </div>

        <div className='mt-10'>
          <button
            onClick={() => setDetails((v) => !v)}
            className='text-xs text-gray-500 underline hover:text-gray-300'
          >
            {details ? 'Hide technical details' : 'Show technical details'}
          </button>
          {details && (
            // Deliberately visible: a visitor who reports the problem can
            // screenshot this instead of us needing their browser console.
            <pre className='mt-4 text-left text-[11px] leading-relaxed text-gray-400 bg-[#111] border border-gray-800 rounded-md p-4 overflow-x-auto whitespace-pre-wrap break-words'>
              {[
                `message: ${error?.message || '(none)'}`,
                `digest:  ${error?.digest || '(none)'}`,
                `page:    ${typeof window !== 'undefined' ? window.location.pathname : ''}`,
                `browser: ${typeof navigator !== 'undefined' ? navigator.userAgent : ''}`,
              ].join('\n')}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
