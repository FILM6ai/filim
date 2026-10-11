'use client';

import React from 'react';

const Button2 = ({button,link}) => {
  return (
    <div>
      <a href={link} target='_blank'>
        <button
          className=' rounded hover:border-[#00a4c2] w-40 py-2 duration-300 transition-all text-white
         border-2 border-white hover:bg-[#00a4c2]  hover:scale-105'
        >
          {button}
        </button>
      </a>
    </div>
  );
};

export default Button2;


