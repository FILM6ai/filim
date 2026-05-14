import Hero from '@/component/mainComponents/home/Hero';
import MetaData from '@/component/mainComponents/home/MetaData';
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
      <Hero />
    </div>
  );
}

export default page