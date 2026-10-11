import MetaData from '@/component/mainComponents/newsPage/MetaData'
import News from '@/component/mainComponents/newsPage/News'
import VideoSection from '@/component/mainComponents/common/VideoSection'
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
        <News/>
      <VideoSection resource='news' pageName='News' />
    </div>
  )
}

export default page