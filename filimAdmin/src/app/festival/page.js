import Hero from '@/component/mainComponents/festival/Hero'
import MetaData from '@/component/mainComponents/festival/MetaData';
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