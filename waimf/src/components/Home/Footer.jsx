'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {BookText as Send,} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from "@/utils/backend";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/footer`
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

  // Partner brands (managed from the admin panel)
  const partners = Array.isArray(footerData?.partners)
    ? footerData.partners.filter((item) => item && (item.name || item.logo))
    : [];

  const hasPartners = partners.length > 0;

  // Keep the row full-width whether or not the partners column is showing,
  // otherwise the newsletter stops sitting flush right.
  const columnSpans = hasPartners
    ? { about: 'md:col-span-3', links: 'md:col-span-2', news: 'md:col-span-3' }
    : { about: 'md:col-span-6', links: 'md:col-span-3', news: 'md:col-span-3' };

  // Partners are typed in by hand, so a link like "acme.com" has to still work
  const partnerHref = (link) => {
    const value = (link || '').trim();
    if (!value) return '#';
    if (/^(https?:)?\/\//i.test(value) || /^mailto:/i.test(value)) return value;
    return `https://${value}`;
  };

  // Handler for subscribing email via the POST API
  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/postemail`,
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
          {/* WAIMF emblem + wordmark. The FILM6 copy fell back to the FILM6
              logo whenever the footer record had no logo of its own - which on
              a brand new database is always. A logo uploaded in the panel's
              Footer screen still takes over. */}
          <Link href={'/'} className='flex items-center gap-3'>
            <Image
              src={footerData?.logo || '/waimf-emblem.png'}
              alt='WAIMF'
              className='w-12 h-12 object-contain'
              width={96}
              height={96}
            />
            {!footerData?.logo && (
              <span className='font-serif text-[22px] tracking-[0.22em] text-[#C8A24A]'>
                W<span className='text-white'>AI</span>MF
              </span>
            )}
          </Link>
          <div className='flex flex-wrap justify-between items-center gap-6'>
            <div>
              <p className='text-[#797979]'>Connect</p>
            </div>
            {/* X, Instagram and YouTube - the three Francois asked for, drawn
                in code like the menu bar. The FILM6 copy used uploaded icon images
                and fell back to the FILM6 LOGO when none was set, so a new,
                empty footer record showed that logo four times over. */}
            <div className='flex items-center justify-end space-x-4'>
              {[
                { label: 'X', href: twitterSocialLink, d: 'M18.9 1.2h3.7l-8.1 9.2 9.5 12.6h-7.4l-5.8-7.6-6.7 7.6H.4l8.6-9.9L.2 1.2h7.6l5.2 6.9ZM17.6 20.8h2L6.5 3.2H4.3Z' },
                { label: 'Instagram', href: instagramSocialLink, d: 'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2Zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4Zm0 8.5a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Zm5.4-9.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z' },
                { label: 'YouTube', href: youtubeSocialLink, d: 'M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.3 3.6Z' },
              ].map((s) => (
                <Link key={s.label} href={s.href} target='_blank' rel='noopener noreferrer' aria-label={s.label}
                  className='h-4 w-4 text-gray-300 hover:text-white transition-colors'>
                  <svg viewBox='0 0 24 24' fill='currentColor' className='h-full w-full'><path d={s.d} /></svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className='pt-6 md:pt-16'>
          {/* Top Section */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-8 mb-8'>
            {/* Logo and Description */}
            <div className={columnSpans.about}>
              <p className='mb-4 max-w-[300px]'>
                {/* The FILM6 copy fell back to Lorem ipsum, which is what a
                    brand new database shows. Editable in the panel's Footer screen. */}
                {footerData?.description ||
                  'The World AI Movie Festival celebrates the films and filmmakers shaping cinema made with artificial intelligence. Puerto Banús, Marbella.'}
              </p>
            </div>

            {/* Partners Section - only takes up space once partners exist */}
            {hasPartners && (
              <div className='md:col-span-4'>
                <h3 className='text-lg mb-4'>PARTNERS</h3>
                <ul
                  className={`space-y-2 ${
                    partners.length > 6 ? 'columns-2 gap-x-6' : ''
                  }`}
                >
                  {partners.map((partner, index) => (
                    <li
                      key={partner._id || `${partner.name}-${index}`}
                      className='break-inside-avoid'
                    >
                      <a
                        href={partnerHref(partner.link)}
                        target='_blank'
                        rel='noopener noreferrer'
                        title={partner.name || 'Partner'}
                        className='group flex items-center gap-2 text-[#737373] hover:text-white transition-colors'
                      >
                        {partner.logo ? (
                          <img
                            src={partner.logo}
                            alt={partner.name || 'Partner'}
                            className='h-6 w-6 object-contain shrink-0 opacity-80 group-hover:opacity-100 transition-opacity'
                          />
                        ) : null}
                        <span className='text-sm'>
                          {partner.name || partner.link}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links Section */}
            <div className={columnSpans.links}>
              <nav className='space-y-3 flex flex-col'>
                {/* Was FAQ -> /faq, a page that only exists on FILM6: a dead link
                    in the footer of every WAIMF page. Rules is WAIMF's answer to
                    the same questions. */}
                <Link
                  href='/rules'
                  className='block text-[#737373] hover:text-white transition-colors'
                >
                  Rules
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
            <div className={columnSpans.news}>
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
        <p className='text-sm text-center'>
          © WAIMF - World AI Movie Festival. All rights reserved.
        </p>
      </div>
      {/* Toast container to show notifications */}
<ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Footer;
