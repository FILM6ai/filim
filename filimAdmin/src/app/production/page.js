import Hero from '@/component/mainComponents/service/Hero'
import MetaData from '@/component/mainComponents/service/MetaData';
import VideoSection from '@/component/mainComponents/common/VideoSection'
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
      <Hero />
      <VideoSection resource='service' pageName='Production' />
    </div>
  );
}

export default page