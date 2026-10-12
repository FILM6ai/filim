'use client';

import React from 'react';

// WAIMF loading screen: the emblem, breathing, on white - the same white the
// landing page now sits on, so there is no black flash before it appears.
// (The FILM6 version was a cyan spinner on black.)
const Loading = () => {
  return (
    <div className='fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-6'>
      <img
        src='/waimf-emblem.png'
        alt='WAIMF'
        width={112}
        height={112}
        className='w-28 h-28 object-contain animate-pulse'
      />
      <div className='font-serif text-[15px] tracking-[0.4em] text-neutral-500 uppercase'>
        WAIMF
      </div>
    </div>
  );
};

export default Loading;
