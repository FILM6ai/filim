import Faq from '@/component/mainComponents/Faqs/Faq'
import FaqHero from '@/component/mainComponents/Faqs/FaqHero'
import MetaData from '@/component/mainComponents/Faqs/MetaData'
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
        <MetaData/>
        <FaqHero/>
        <Faq/>
    </div>
  )
}

export default page