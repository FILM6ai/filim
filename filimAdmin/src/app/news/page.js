import MetaData from '@/component/mainComponents/newsPage/MetaData'
import News from '@/component/mainComponents/newsPage/News'
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
        <News/>
    </div>
  )
}

export default page