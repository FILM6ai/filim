import Hero from '@/component/mainComponents/studio/Hero'
import MetaData from '@/component/mainComponents/studio/MetaData'
import VideoSection from '@/component/mainComponents/common/VideoSection'
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
        <Hero/>
      <VideoSection
        resource='studio'
        pageName='Studio - first video'
        intro='This is the FIRST video on the Studio page, the one nearer the top. Leave it empty and it does not appear on the website at all.'
      />
      {/* The second block writes to its own field through its own route, so the
          two never overwrite each other - see VideoSection.jsx. */}
      <VideoSection
        resource='studio'
        path='videosection2'
        pageName='Studio - second video'
        intro='This is the SECOND video on the Studio page, shown further down, just above the last section, Animation Engine. Leave it empty and it does not appear on the website at all.'
      />
    </div>
  )
}

export default page