'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {BookText as Send,} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/images/logo.png';

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/footer`
        );
        if (data.footer && data.footer.length > 0) {
          setFooterData(data.footer[0]);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };
    fetchFooter();
  }, []);

  // Social links fallback values
  const tiktokSocialLink =
    footerData?.links?.find((item) => item.name.toLowerCase() === 'tiktok')
      ?.link || 'https://tiktok.com';
  const youtubeSocialLink =
    footerData?.links?.find((item) => item.name.toLowerCase() === 'youtube')
      ?.link || 'https://youtube.com';
  const instagramSocialLink =
    footerData?.links?.find((item) => item.name.toLowerCase() === 'instagram')
      ?.link || 'https://instagram.com';
  const twitterSocialLink =
    footerData?.links?.find((item) => item.name.toLowerCase() === 'twitter')
      ?.link || 'https://twitter.com';

  // Handler for subscribing email via the POST API
  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/postemail`,
        { email }
      );
      if (response.data.success) {
        console.log(response.data,'response');
        
        toast.success('Email submitted successfully.');
        setEmail('');
      } else {
        toast.error('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <footer className='bg-black text-white py-6 px-4 sm:px-6 lg:px-20'>
        <div className='border-b pb-4 flex flex-wrap gap-6 justify-between items-center '>
          <Link href={'/'}>
            <Image
              src={footerData?.logo || logo}
              alt='logo'
              className='lg:w-28 md:w-44 sm:w-44 w-28'
              width={300}
              height={300}
            />
          </Link>
          <div className='flex flex-wrap justify-between items-center gap-6'>
            <div>
              <p className='text-[#797979]'>Connect</p>
            </div>
            <div className='flex items-center justify-end space-x-4'>
              <Link
                href={twitterSocialLink}
                target='_blank'
                aria-label='Twitter'
              >
                <Image
                  src={footerData?.twitterIcon || logo}
                  width={300}
                  height={300}
                  alt='Twitter'
                  className='object-contain h-4 w-4'
                />
              </Link>
              <Link
                href={instagramSocialLink}
                target='_blank'
                aria-label='Instagram'
              >
                <Image
                  src={footerData?.instaIcon || logo}
                  width={300}
                  height={300}
                  alt='Instagram'
                  className='object-contain h-4 w-4'
                />
              </Link>
              <Link
                href={youtubeSocialLink}
                target='_blank'
                aria-label='YouTube'
              >
                <Image
                  src={footerData?.youtubeIcon || logo}
                  width={300}
                  height={300}
                  alt='YouTube'
                  className='object-contain h-4 w-4'
                />
              </Link>
              <Link href={tiktokSocialLink} target='_blank' aria-label='TikTok'>
                <Image
                  src={footerData?.tiktokIcon || logo}
                  width={300}
                  height={300}
                  alt='TikTok'
                  className='object-contain h-4 w-4'
                />
              </Link>
            </div>
          </div>
        </div>
        <div className='pt-6 md:pt-16'>
          {/* Top Section */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-8 mb-8'>
            {/* Logo and Description */}
            <div className='md:col-span-4'>
              <p className='mb-4 max-w-[300px]'>
                {footerData?.description ||
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
              </p>
            </div>

            {/* Links Section */}
            <div className='md:col-span-4'>
              <nav className='space-y-3 flex flex-col md:items-center'>
                <Link
                  href='/faq'
                  className='block text-[#737373] hover:text-white transition-colors'
                >
                  FAQ
                </Link>
                <Link
                  href='/terms'
                  className='block text-[#737373] hover:text-white transition-colors'
                >
                  Terms
                </Link>
              </nav>
            </div>

            {/* Newsletter Section */}
            <div className='md:col-span-4'>
              <h3 className='text-lg mb-4'>Newsletter</h3>
              <p className='text-[#737373] mb-4'>Subscribe to Our Newsletter</p>
              <form
                onSubmit={handleSubscribe}
                className='relative text-black bg-white'
              >
                <input
                  type='email'
                  placeholder='Email Address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full text-black bg-transparent border border-gray-700 px-4 py-4'
                />
                <button
                  type='submit'
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-black transition-colors'
                >
                  <Send size={22} />
                </button>
              </form>
              <div className='flex items-center mt-4'>
                <input type='checkbox' id='terms' className='mr-2' />
                <label htmlFor='terms' className='text-sm text-[#737373]'>
                  I agree to all terms and policies of the company
                </label>
              </div>
            </div>
          </div>
          {/* Bottom Section */}
        </div>
      </footer>
      <div className='bg-[#131313] text-white py-4'>
        <p className='text-sm text-center'>© 2025 Film6</p>
      </div>
      {/* Toast container to show notifications */}
<ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Footer;
