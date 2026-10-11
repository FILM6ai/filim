'use client';

import React from 'react';

const Button = ({button,link}) => {
  return (
    <div>
      <a href={link} target='_blank'>
        <button
          className=' rounded w-40 py-2 duration-300 transition-all text-white
         bg-black hover:bg-[#00a4c2]  hover:scale-105'
        >
          {button}
        </button>
      </a>
    </div>
  );
};

export default Button;


