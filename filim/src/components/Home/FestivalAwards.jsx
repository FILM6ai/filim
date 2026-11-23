'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

// The FESTIVAL AWARDS list on film6.ai/festival, the same table as on
// waimf.org - Francois, 23 Nov: the old card list here "looks bad and is a
// pain to manage".
//
// It reads the awards straight from the WAIMF back end, so there is ONE list
// to keep up to date: the Awards tab of the WAIMF panel. Whatever is saved
// there shows on both sites.
const WAIMF_API = 'https://waimf-backend.vercel.app/api/waimf/getwaimf';

const GOLD = '#C8A24A';

const FestivalAwards = () => {
  const [awards, setAwards] = useState(null);

  useEffect(() => {
    let live = true;
    axios
      .get(WAIMF_API)
      .then(({ data }) => {
        const doc = Array.isArray(data?.waimf) ? data.waimf[0] : null;
        if (live) setAwards(doc?.awards || null);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const cards = (awards?.cards || []).filter((card) => String(card?.title || '').trim());
  if (cards.length === 0) return null;

  return (
    <section className='bg-white py-14 lg:py-20'>
      <div className='max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14'>
        <div className='max-w-[62ch] mb-12'>
          <div
            className='text-[10.5px] tracking-[0.34em] uppercase mb-4'
            style={{ color: GOLD }}
          >
            Awards
          </div>
          {awards.mainTitle && (
            <h2 className='font-serif text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.08] font-normal text-black'>
              {awards.mainTitle}
            </h2>
          )}
          {awards.description && (
            <p className='text-[15.5px] leading-[1.72] text-neutral-600 mt-4 max-w-[58ch] whitespace-pre-line'>
              {awards.description}
            </p>
          )}
        </div>
        {/* Numbered down the first column, then the second - the order
            Francois asked for on waimf.org (4 Nov). */}
        <ul
          className='grid md:grid-cols-2 md:grid-flow-col gap-x-[70px]'
          style={{ gridTemplateRows: `repeat(${Math.ceil(cards.length / 2)}, auto)` }}
        >
          {cards.map((card, i) => (
            <li
              key={card._id || i}
              className='border-t border-neutral-200 py-[21px] flex gap-4 items-baseline'
            >
              <i
                className='not-italic font-serif text-[14px] w-7 shrink-0'
                style={{ color: GOLD }}
              >
                {String(i + 1).padStart(2, '0')}
              </i>
              <b className='font-normal text-[17px] text-black'>{card.title}</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FestivalAwards;
