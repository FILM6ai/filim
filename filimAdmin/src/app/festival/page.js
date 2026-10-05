import Hero from '@/component/mainComponents/festival/Hero'
import MetaData from '@/component/mainComponents/festival/MetaData';
import VideoSection from '@/component/mainComponents/common/VideoSection'
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
      <Hero />
      {/* Four video blocks, each writing to its own field through its own route,
          so none of them can overwrite another - see VideoSection.jsx.

          They are listed here in the order they appear on the website, top to
          bottom. That is deliberately NOT the order of the route numbers:
          videosection2 was built as the bottom one before three and four were
          added above it, and renumbering would mean moving live content. The
          label each block carries is its position on the page; the route under
          it is just plumbing.

            1st  videosection   above Festival Selection
            2nd  videosection3  under Festival Selection
            3rd  videosection4  under A Celebration of Human Talent & Technology
            4th  videosection2  at the bottom, above Exploring the AI Revolution
      */}
      <VideoSection
        resource='festival'
        pageName='Festival - first video'
        intro='1st of four. Near the top of the Festival page, between Global Exposure and Festival Selection. Leave it empty and it does not appear on the website at all.'
      />
      <VideoSection
        resource='festival'
        path='videosection3'
        pageName='Festival - second video'
        intro='2nd of four. Directly under the FESTIVAL SELECTION section. Leave it empty and it does not appear on the website at all.'
      />
      <VideoSection
        resource='festival'
        path='videosection4'
        pageName='Festival - third video'
        intro='3rd of four. Directly under the A CELEBRATION OF HUMAN TALENT & TECHNOLOGY section. Leave it empty and it does not appear on the website at all.'
      />
      <VideoSection
        resource='festival'
        path='videosection2'
        pageName='Festival - fourth video'
        intro='4th of four. At the bottom of the page, just above the last section, Exploring the AI Revolution. Leave it empty and it does not appear on the website at all.'
      />
    </div>
  );
}

export default page