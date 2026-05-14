'use client';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';
import twit from '../../assets/images/twit.png';
import tiktok from '../../assets/images/tiktok.png';
import insta from '../../assets/images/insta.png';
import youtube from '../../assets/images/youtube.png';
import axios from 'axios';

const Navbar = () => {
  const [footerData, setFooterData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('');

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

  const linksStatic = [
    { name: 'Studio', link: '/studio' },
    { name: 'Services', link: '/services' },
    { name: 'Festival', link: '/festival' },
    { name: 'News', link: '/news' },
    { name: 'Contact', link: '/contact' },
  ];

  return (
    <div
      className={`sticky top-0 w-full z-50 text-white transition-all duration-300`}
    >
      {/* pushing the latest code  */}
      <div
        className={`bg-black/70 backdrop-blur-md  absolute left-0 right-0 px-4 sm:px-6 lg:px-20`}
      >
        <div className='flex items-center gap-3 max-md:justify-start justify-between pt-9 pb-9 h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link
              href='/'
              onClick={() => {
                setActiveNav('/');
              }}
              className='flex items-center space-x-2 relative z-10'
            >
              <Image
                src={footerData?.logo || logo}
                width={200}
                height={200}
                alt='Logo'
                className='object-contain lg:w-28 md:w-44 sm:w-44 w-28'
              />
            </Link>
          </div>

          {/* Hamburger Icon (Mobile) */}
          <div className='max-[920px]:block hidden absolute right-4'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='relative z-50 text-white focus:outline-none'
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className={`font-sans font-normal min-[920px]:flex min-[920px]:items-center min-[920px]:gap-12 absolute -top-4 left-0 w-full bg-heading transition-all duration-500 ease-in-out transform ${
              isOpen
                ? 'translate-x-0 opacity-100 py-16'
                : '-translate-x-full opacity-0'
            } min-[920px]:opacity-100 min-[920px]:translate-x-0 min-[920px]:h-auto min-[920px]:block min-[920px]:static min-[920px]:w-auto min-[920px]:bg-transparent`}
          >
            <div className='flex flex-col min-[920px]:flex-row items-center space-y-4 min-[920px]:space-y-0 min-[920px]:space-x-8 p-4 min-[920px]:p-0'>
              <Link
                href='/'
                className={`hover:text-[#2ec3f5] pb-2 hover:border-b-2 border-[#2ec3f5] transition-colors text-[22px] ${
                  activeNav === '/' ? 'text-[#2ec3f5] border-b-2' : ''
                }`}
                onClick={() => {
                  setActiveNav('/');
                  setIsOpen(false);
                }}
              >
                {/* <FaHome size={30} /> */}
              </Link>
              {linksStatic.map((item, ind) => (
                <Link
                  key={ind}
                  href={item.link}
                  className={`hover:text-[#2ec3f5] pb-1 hover:border-b-2 border-[#2ec3f5] transition-colors text-[20px] ${
                    activeNav === item.link ? 'text-[#2ec3f5] border-b-2' : ''
                  }`}
                  onClick={() => {
                    setActiveNav(item.link);
                    setIsOpen(false);
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* ✅ Social Icons for Mobile Menu (NEWLY ADDED) */}
            <div className='flex justify-center items-center space-x-4 mt-6 min-[920px]:hidden'>
              <Link href={twitterSocialLink} target='_blank'>
                <Image
                  width={12}
                  height={12}
                  src={footerData?.twitterIcon || twit}
                  alt='Twitter Icon'
                  className='object-contain h-5 w-5'
                />
              </Link>
              <Link href={instagramSocialLink} target='_blank'>
                <Image
                  width={12}
                  height={12}
                  src={footerData?.instaIcon || insta}
                  alt='Instagram Icon'
                  className='object-contain h-5 w-5'
                />
              </Link>
              <Link href={youtubeSocialLink} target='_blank'>
                <Image
                  width={12}
                  height={12}
                  src={footerData?.youtubeIcon || youtube}
                  alt='YouTube Icon'
                  className='object-contain h-5 w-5'
                />
              </Link>
              <Link href={tiktokSocialLink} target='_blank'>
                <Image
                  width={12}
                  height={12}
                  src={footerData?.tiktokIcon || tiktok}
                  alt='TikTok Icon'
                  className='object-contain h-5 w-5'
                />
              </Link>
            </div>
          </div>

          {/* Social Icons for Desktop */}
          <div className='flex items-center max-[920px]:hidden max-[920px]:justify-center max-sm:mt-4 space-x-4'>
            <Link href={twitterSocialLink} target='_blank'>
              <Image
                width={12}
                height={12}
                src={footerData?.twitterIcon || twit}
                alt='Twitter Icon'
                className='object-contain h-4 w-4'
              />
            </Link>
            <Link href={instagramSocialLink} target='_blank'>
              <Image
                width={12}
                height={12}
                src={footerData?.instaIcon || insta}
                alt='Instagram Icon'
                className='object-contain h-4 w-4'
              />
            </Link>
            <Link href={youtubeSocialLink} target='_blank'>
              <Image
                width={12}
                height={12}
                src={footerData?.youtubeIcon || youtube}
                alt='YouTube Icon'
                className='object-contain h-4 w-4'
              />
            </Link>
            <Link href={tiktokSocialLink} target='_blank'>
              <Image
                width={12}
                height={12}
                src={footerData?.tiktokIcon || tiktok}
                alt='TikTok Icon'
                className='object-contain h-4 w-4'
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
