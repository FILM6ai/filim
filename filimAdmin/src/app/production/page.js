import Hero from '@/component/mainComponents/service/Hero'
import MetaData from '@/component/mainComponents/service/MetaData';
import VideoSection from '@/component/mainComponents/common/VideoSection'
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
      <Hero />
      <VideoSection
        resource='service'
        pageName='Production - first video'
        intro='This is the FIRST video on the Production page, the one nearer the top. Leave it empty and it does not appear on the website at all.'
      />
      {/* The second block writes to its own field through its own route, so the
          two never overwrite each other - see VideoSection.jsx. */}
      <VideoSection
        resource='service'
        path='videosection2'
        pageName='Production - second video'
        intro='This is the SECOND video on the Production page, shown further down, just above the last section, WAIMF Celebrating Innovation. Leave it empty and it does not appear on the website at all.'
      />
    </div>
  );
}

export default page