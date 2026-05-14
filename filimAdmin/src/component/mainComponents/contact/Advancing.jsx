
'use client';

import React from 'react';

const Advancing = ({advance,setAdvance}) => {
 
const onChangeHandler = (event) => {
  const name = event.target.name;
  const value = event.target.value;
  setAdvance((data) => ({ ...data, [name]: value }));
};
  
  return (
    <div>
      <div className=' mt-12 p-4 border'>
        {' '}
        <h1 className='mt-4 mb-12 text-center text-3xl font-semibold'>
           SECTION 1
        </h1>
        <form>
          <div className='mt-8'>
            <div className='mb-4'>
              <h1 className='text-black'>TITLE</h1>
              <input
                type='text'
                placeholder='Title'
                className='border border-black px-3 py-2 mt-2 outline-0 w-full'
                value={advance.title}
                onChange={onChangeHandler}
                name='title'
              />
            </div>
          
            <div className='mb-4 mt-4'>
              <h1 className='text-black'>DESCRIPTION</h1>
              <textarea
                placeholder='Description'
                className='border border-black px-3 py-2 mt-2 outline-0 w-full'
                value={advance.description}
                onChange={onChangeHandler}
                name='description'
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Advancing;
