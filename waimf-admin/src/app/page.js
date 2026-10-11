'use client';

import Link from 'next/link';

// The panel's front page. The FILM6 version rendered the home-page editor here;
// this one has no home page to edit, so it is a plain way in.
const LINKS = [
  { href: '/waimf', label: 'WAIMF site', note: 'Header, winners, selection, jury, gallery, rules' },
  { href: '/blog', label: 'News articles', note: 'Write and edit news' },
  { href: '/contact', label: 'Contact page', note: 'The contact page content' },
  { href: '/footer', label: 'Footer', note: 'Social links, partners, newsletter' },
  { href: '/menu', label: 'Menu', note: 'The navigation bar' },
  { href: '/registrations', label: 'Submissions', note: 'Film submissions received' },
  { href: '/email', label: 'Newsletter', note: 'Subscribers' },
  { href: '/account', label: 'Your account', note: 'Password and sign-in' },
];

export default function Dashboard() {
  return (
    <div className='pt-12 px-6 pb-24 max-w-[900px]'>
      <h1 className='text-2xl font-semibold text-black'>WAIMF admin</h1>
      <p className='text-sm text-gray-600 mt-1 mb-8'>
        This panel edits waimf.org only. The FILM6 site has its own, separate
        panel - nothing changed here can affect film6.ai.
      </p>

      <div className='grid sm:grid-cols-2 gap-4'>
        {LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className='block border border-gray-300 p-4 hover:border-black transition-colors'
          >
            <span className='block font-medium text-black'>{item.label}</span>
            <span className='block text-sm text-gray-500 mt-1'>{item.note}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
