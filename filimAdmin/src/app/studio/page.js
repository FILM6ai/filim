import Hero from '@/component/mainComponents/studio/Hero'
import MetaData from '@/component/mainComponents/studio/MetaData'
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
        <Hero/>
    </div>
  )
}

export default page