'use client';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/backend';

// WAIMF navigation.
//
// Three deliberate differences from the FILM6 bar this was copied from:
//
//  1. The brand is the reel-and-brain emblem plus the wordmark, not a flat
//     logo image. Francois asked for "only the logo" - the emblem on its own,
//     not the full lockup with the laurels and OFFICIAL CEREMONY underneath.
//  2. The "Submit your film" button on the right is gone, replaced by X,
//     Instagram and YouTube.
//  3. There is no home icon. Every item is a real page, and the emblem is the
//     way back to the front.
const LINKS = [
  // The front page IS the 2026 edition, so this points home rather than at a
  // second page repeating it.
  { name: 'Edition 2026', link: '/' },
  { name: 'Top Filmmakers', link: '/top-filmmakers' },
  { name: 'Official Selection', link: '/selection' },
  { name: 'Gallery', link: '/gallery' },
  { name: 'Rules', link: '/rules' },
  { name: 'News', link: '/news' },
  { name: 'Contact', link: '/contact' },
];

// Inline rather than imported images: three small shapes that must sit on a
// photograph at any size and take their colour from the surrounding text.
const ICONS = {
  x: 'M18.9 1.2h3.7l-8.1 9.2 9.5 12.6h-7.4l-5.8-7.6-6.7 7.6H.4l8.6-9.9L.2 1.2h7.6l5.2 6.9ZM17.6 20.8h2L6.5 3.2H4.3Z',
  instagram:
    'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4 1.3-.1 1.7-.1 4.8-.1Zm0 1.9c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.3-.5.2-.9.4-1.2.8-.4.3-.6.7-.8 1.2-.1.4-.3 1-.3 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.3 2.1.2.5.4.9.8 1.2.3.4.7.6 1.2.8.4.1 1 .3 2.1.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.3.5-.2.9-.4 1.2-.8.4-.3.6-.7.8-1.2.1-.4.3-1 .3-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.3-2.1-.2-.5-.4-.9-.8-1.2-.3-.4-.7-.6-1.2-.8-.4-.1-1-.3-2.1-.3-1.2-.1-1.6-.1-4.7-.1Zm0 3.3a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 7.6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5.9-7.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z',
  youtube:
    'M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.3 3.6Z',
};

const Social = ({ href, label, path, size = 'h-[17px] w-[17px]' }) => (
  <Link
    href={href || '#'}
    target={href ? '_blank' : undefined}
    rel={href ? 'noopener noreferrer' : undefined}
    aria-label={label}
    className={`${size} text-gray-300 hover:text-white transition-colors`}
  >
    <svg viewBox='0 0 24 24' fill='currentColor' className='h-full w-full'>
      <path d={path} />
    </svg>
  </Link>
);

const Navbar = () => {
  const [footerData, setFooterData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('');

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/footer`);
        if (data.footer && data.footer.length > 0) setFooterData(data.footer[0]);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };
    fetchFooter();
  }, []);

  // The three addresses come from the same CMS record the footer uses, so they
  // are set in one place. Until WAIMF's own accounts are entered there, the
  // icons render but do not link anywhere - which is honest, where pointing
  // them at FILM6's accounts would not be.
  const socialLink = (name) =>
    footerData?.links?.find((item) => item.name?.toLowerCase() === name)?.link || '';

  const socials = [
    { label: 'X', href: socialLink('twitter'), path: ICONS.x },
    { label: 'Instagram', href: socialLink('instagram'), path: ICONS.instagram },
    { label: 'YouTube', href: socialLink('youtube'), path: ICONS.youtube },
  ];

  return (
    <div className='sticky top-0 w-full z-50 text-white transition-all duration-300'>
      <div className='bg-black/70 backdrop-blur-md absolute left-0 right-0 px-4 sm:px-6 lg:px-12'>
        <div className='flex items-center gap-3 max-[1180px]:justify-start justify-between py-5 h-16 max-w-[1400px] mx-auto'>
          {/* Brand */}
          <Link
            href='/'
            onClick={() => setActiveNav('/')}
            className='flex items-center gap-3 relative z-10 flex-shrink-0'
          >
            <Image
              src='/waimf-emblem.png'
              width={104}
              height={104}
              alt='WAIMF'
              priority
              className='object-contain w-11 h-11 lg:w-[52px] lg:h-[52px] brightness-110'
            />
            <span className='font-serif text-[19px] lg:text-[23px] tracking-[0.22em] leading-none pt-[2px]'>
              WAIMF
            </span>
          </Link>

          {/* Hamburger (mobile) */}
          <div className='max-[1180px]:block hidden absolute right-4'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='relative z-50 text-white focus:outline-none'
              aria-label='Menu'
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Links */}
          <div
            className={`font-sans font-normal min-[1180px]:flex min-[1180px]:items-center absolute -top-4 left-0 w-full bg-black transition-all duration-500 ease-in-out transform ${
              isOpen
                ? 'translate-x-0 opacity-100 py-16'
                : '-translate-x-full opacity-0'
            } min-[1180px]:opacity-100 min-[1180px]:translate-x-0 min-[1180px]:h-auto min-[1180px]:static min-[1180px]:w-auto min-[1180px]:bg-transparent min-[1180px]:ml-auto`}
          >
            <div className='flex flex-col min-[1180px]:flex-row items-center gap-5 min-[1180px]:gap-7 p-4 min-[1180px]:p-0'>
              {LINKS.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className={`uppercase tracking-[0.16em] text-[15px] min-[1180px]:text-[11.5px] whitespace-nowrap pb-[3px] border-b transition-colors hover:text-white ${
                    activeNav === item.link
                      ? 'text-white border-[#C8A24A]'
                      : 'text-gray-300 border-transparent'
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

            {/* Socials, inside the drawer on mobile */}
            <div className='flex justify-center items-center gap-6 mt-8 min-[1180px]:hidden'>
              {socials.map((s) => (
                <Social key={s.label} {...s} size='h-6 w-6' />
              ))}
            </div>
          </div>

          {/* Socials, desktop - where SUBMIT YOUR FILM used to be */}
          <div className='flex items-center gap-4 max-[1180px]:hidden pl-8 ml-7 border-l border-white/20'>
            {socials.map((s) => (
              <Social key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
