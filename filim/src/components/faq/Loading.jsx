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
import { Sparkles } from 'lucide-react'; // Optional: you can use any AI-style icon

const Loading = () => {
  return (
    <div className='fixed inset-0 z-50 bg-black flex flex-col items-center justify-center space-y-6'>
      {/* Glowing AI Circle */}
      <div className='w-24 h-24 border-4 border-cyan-400 rounded-full animate-pulse shadow-[0_0_30px_rgba(34,211,238,0.6)] flex items-center justify-center relative'>
        <Sparkles className='text-cyan-300 animate-spin-slow w-10 h-10' />
      </div>

      {/* AI Loading Text */}
      <div className='text-lg md:text-xl text-cyan-300 font-medium tracking-widest flex space-x-1'>
        <span>Loading</span>
        <span className='animate-bounce [animation-delay:0s]'>.</span>
        <span className='animate-bounce [animation-delay:0.2s]'>.</span>
        <span className='animate-bounce [animation-delay:0.4s]'>.</span>
      </div>
    </div>
  );
};

export default Loading;

