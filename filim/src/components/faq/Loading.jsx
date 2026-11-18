// // components/Loader.jsx
// 'use client';

// import { motion } from 'framer-motion';

// const Loading = () => {
//   return (
//     <div className='fixed inset-0 z-50 flex items-center justify-center bg-white'>
//       <motion.div
//         className='w-16 h-16 border-4 border-indigo-500 border-dashed rounded-full animate-spin'
//         initial={{ scale: 0.8 }}
//         animate={{ scale: 1 }}
//         transition={{ repeat: Infinity, duration: 1 }}
//       />
//       <span className='ml-4 text-xl font-semibold text-indigo-600'>
//         Loading Film6...
//       </span>
//     </div>
//   );
// };

// export default Loading;


import React from 'react';

// The loading screen shows the FILM6 "6" itself (cut from the real logo,
// /film6-6.png) instead of the generic sparkle icon - Francois, 18 Nov.
// Plain <img>, not next/image: it has to appear instantly, before anything
// else on the page has loaded.
const Loading = () => {
  return (
    <div className='fixed inset-0 z-50 bg-black flex flex-col items-center justify-center space-y-6'>
      <img
        src='/film6-6.png'
        alt='FILM6'
        width={112}
        height={112}
        className='w-24 h-24 md:w-28 md:h-28 animate-pulse drop-shadow-[0_0_24px_rgba(140,180,215,0.45)]'
      />

      <div className='text-lg md:text-xl text-neutral-300 font-medium tracking-widest flex space-x-1'>
        <span>Loading</span>
        <span className='animate-bounce [animation-delay:0s]'>.</span>
        <span className='animate-bounce [animation-delay:0.2s]'>.</span>
        <span className='animate-bounce [animation-delay:0.4s]'>.</span>
      </div>
    </div>
  );
};

export default Loading;
