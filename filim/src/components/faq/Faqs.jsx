'use client';
import { useState } from 'react';

export default function Faqs({ faqs }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggle = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className='flex relative z-40 my-32 items-center justify-center'>
      <div className='mx-auto w-full max-w-2xl px-2'>
        <h1 className='mb-8 font-sans text-center text-3xl font-semibold'>
          Frequently Asked Questions
        </h1>
        {faqs.map((faqItem, index) => (
          <div key={index} className='mb-4 rounded-lg border bg-white'>
            <button
              onClick={() => toggle(index)}
              className='flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none'
            >
              <span className='text-lg font-medium font-sans'>
                {faqItem.title}
              </span>
              <span>{openFaq === index ? '−' : '+'}</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className='px-6 pb-4'>
                <p className='text-gray-600 font-sans '>{faqItem.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
