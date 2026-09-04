import Hero from '@/component/mainComponents/festival/Hero'
import MetaData from '@/component/mainComponents/festival/MetaData';
import VideoSection from '@/component/mainComponents/common/VideoSection'
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
      <Hero />
      <VideoSection resource='festival' pageName='Festival' />
    </div>
  );
}

export default page