'use client';

import axios from 'axios';
import { validateFile } from '@/utils/fileValidation';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const FaqHero = () => {
 const [faqDataId, setfaqDataId] = useState(null);
 const [title, setTitle] = useState('');
   const [alt, setAlt] = useState('');
   const [image, setImage] = useState(null);
   const [youtubeUrl, setYoutubeUrl] = useState('');
 const [description, setdescription] = useState('');
 const [loading, setLoading] = useState(false);

 useEffect(() => {
   const fetchData = async () => {
     try {
       const { data } = await axios.get(
         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/faq/faqgetroute`
       );
       console.log(data.faqData, 'Response from API');

       if (data.faqData && data.faqData.length > 0) {
         const faqPage = data.faqData[0];
         setfaqDataId(faqPage._id || null); // Ensure ID is correctly set

         if (faqPage.faqhero) {
             setTitle(faqPage.faqhero.title || '');
             setImage(faqPage.faqhero.bgImage || null);
             setdescription(faqPage.faqhero.description || '');
             setAlt(faqPage.faqhero.alt || '');
             setYoutubeUrl(faqPage.faqhero.youtubeUrl || '');
           }
       }
     } catch (error) {
       console.error('Error fetching data:', error);
       toast.error('Error fetching data');
     }
   };

   fetchData();
 }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);

   try {
     const formData = new FormData();
     const hero = { title, description, alt, youtubeUrl };

     // If admin explicitly cleared image, include empty string to tell backend to clear
     if (image === '') {
       hero.bgImage = '';
     }

     formData.append('faqhero', JSON.stringify(hero));

     if (image && image instanceof File) {
       formData.append('heroImage', image);
     }

     let response;
     if (faqDataId) {
       // Update existing FAQ page
       response = await axios.put(
         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/faq/faqupdateroute/${faqDataId}`,
         formData,
         {
           headers: { 'Content-Type': 'multipart/form-data' },
         }
       );
       toast.success('FAQ page updated successfully!');
     } else {
       // Create a new FAQ page
       response = await axios.post(
         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/faq/faqpostroute`,
         formData,
         {
           headers: { 'Content-Type': 'multipart/form-data' },
         }
       );
       toast.success('FAQ page created successfully!');
     }

     console.log('Response:', response.data);
   } catch (error) {
     console.error('Error submitting data:', error);
     toast.error('Error submitting data');
   } finally {
     setLoading(false);
   }
 };


  return (
    <div className=''>
      <div className='p-4 border'>
        <h1 className='mt-4 mb-12 text-center text-3xl font-semibold'>
          FAQ HERO SECTION
        </h1>
        <form>
          <div className='rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36'>
            <label
              htmlFor='upload2'
              className='flex flex-col items-center gap-2 cursor-pointer'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 fill-white stroke-indigo-500'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              <span className='text-gray-600 font-medium'>Upload file</span>
            </label>
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const result = validateFile(file);
                if (!result.valid) {
                  toast.error(result.message);
                  return;
                }
                setImage(file);
              }}
              id='upload2'
              type='file'
              accept='image/*,video/*'
              className='hidden'
            />
          </div>
          {/* Image Preview */}
          {image && (
            <div className='mt-4'>
              {typeof image === 'string' ? (
                image.endsWith('.mp4') || image.includes('video') ? (
                  <video src={image} controls className='w-36 h-auto' />
                ) : (
                  <img src={image} alt={alt || 'preview'} className='w-36 h-auto' />
                )
              ) : image instanceof File ? (
                image.type.startsWith('video/') ? (
                  <video src={URL.createObjectURL(image)} controls className='w-36 h-auto' />
                ) : (
                  <img src={URL.createObjectURL(image)} alt={alt || 'preview'} className='w-36 h-auto' />
                )
              ) : null}
            </div>
          )}
          <div className='mt-4'>
            <label className='text-sm font-medium'>YouTube URL (optional)</label>
            <input
              type='text'
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder='https://www.youtube.com/watch?v=...'
              className='border px-2 py-1 w-full mt-2'
            />
            <div className='flex gap-2 mt-2'>
              <button
                type='button'
                onClick={() => {
                  setImage(null);
                }}
                className='text-sm px-2 py-1 bg-gray-200'
              >
                Remove Image
              </button>
              <button
                type='button'
                onClick={() => setYoutubeUrl('')}
                className='text-sm px-2 py-1 bg-gray-200'
              >
                Remove YouTube URL
              </button>
            </div>
          </div>
          <div className='mt-8'>
            <div className='mb-4'>
              <h1 className='text-black'>ALT TEXT</h1>
              <input
                type='text'
                placeholder='Alt Text'
                className='border border-black px-3 py-2 mt-2 outline-0'
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <h1 className='text-black'>Title</h1>
              <input
                type='text'
                placeholder='Title'
                className='border border-black px-3 py-2 mt-2 outline-0 w-full'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <h1 className='text-black'>Description</h1>

              <textarea
                type='text'
                placeholder='Description Text'
                className=' w-full border border-black px-3 py-2 mt-2 outline-0'
                value={description}
                onChange={(e) => setdescription(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
      <div className='flex justify-end mt-8 mb-8'>
        <button
          onClick={handleSubmit}
          type='submit'
          disabled={loading}
          className='bg-blue-600 hover:bg-blue-800 cursor-pointer text-white px-12 py-2 rounded-sm'
        >
          {loading ? 'Loading...' : faqDataId ? 'Update' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default FaqHero;
