import Hero from '@/component/mainComponents/service/Hero'
import MetaData from '@/component/mainComponents/service/MetaData';
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