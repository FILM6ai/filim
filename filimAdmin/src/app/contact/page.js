import Contact from '@/component/mainComponents/contact/Contact'
import Form from '@/component/mainComponents/contact/Form'
import MetaData from '@/component/mainComponents/contact/MetaData'
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData/>
        <Contact/>
        <Form/>
    </div>
  )
}

export default page