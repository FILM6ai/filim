'use client';

import React from 'react';

// WAIMF loading screen: the gold W from the favicon, breathing, on black.
// Francois: "favicon on black screen". The W's own square is black too, so it
// sits on the page with no visible edge.
// (The FILM6 version was a cyan spinner on black.)
const Loading = () => {
  return (
    <div className='fixed inset-0 z-50 bg-black flex items-center justify-center'>
      <img
        src='/waimf-w.png'
        alt='WAIMF'
        width={112}
        height={112}
        className='w-24 h-24 sm:w-28 sm:h-28 object-contain animate-pulse'
      />
    </div>
  );
};

export default Loading;
