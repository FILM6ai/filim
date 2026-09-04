import Hero from '@/component/mainComponents/studio/Hero'
import MetaData from '@/component/mainComponents/studio/MetaData'
import VideoSection from '@/component/mainComponents/common/VideoSection'
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
        <Hero/>
      <VideoSection resource='studio' pageName='Studio' />
    </div>
  )
}

export default page