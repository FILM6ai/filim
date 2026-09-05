import Hero from '@/component/mainComponents/home/Hero';
import MetaData from '@/component/mainComponents/home/MetaData';
import VideoSection from '@/component/mainComponents/common/VideoSection';
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
      <Hero />
      {/* The home page's second video block. It saves on its own button rather
          than through the form above, which rebuilds the sections it is given -
          see VideoSection.jsx. The first video block stays inside Hero. */}
      <VideoSection
        resource='home'
        path='videosection2'
        pageName='Home - second video'
        intro='This is the SECOND video on the home page, shown just above the Cinematic Metaverse section. Leave it empty and it does not appear on the website at all. The first video, higher up the page, is edited in the section above.'
      />
    </div>
  );
}

export default page
