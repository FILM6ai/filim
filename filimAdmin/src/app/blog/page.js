import Blog from '@/component/mainComponents/blogs/Blog'
import MetaData from '@/component/mainComponents/blogs/MetaData';
import React from 'react'

const page = () => {
  return (
    <div className='pt-12'>
      <MetaData />
      <Blog />
    </div>
  );
}

export default page