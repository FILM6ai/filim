'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import slugify from 'slugify';
import { API_BASE_URL } from "@/utils/backend";


// The landing page shows articles twice, like waimf.org - Francois, 18 Nov:
// the newest three just under "A New Era of Cinema" (`skip` 0, `count` 3,
// `compact`), and the bottom block carrying on from the fourth, so nothing
// appears twice on the page.
const Blogs = ({ count = 6, skip = 0, compact = false, title = 'Latest News & Articles From The Post' }) => {
  
  const [bloges, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/blog/getblog`
        );
        console.log(data.blogs, 'api response for blogs');

        if (data.blogs && data.blogs.length > 0) {
          setBlogs(data.blogs);
        } else {
          console.error('Failed to fetch blogs:', data.message);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
    };

    fetchBlogs();
  }, []);

  // Newest first BEFORE picking, so "the latest three" really are the latest.
  const shown = [...bloges]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(skip, skip + count);

  if (!shown.length) return null;

  const cards = (
    <div className='relative  z-10 mb-12 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-8'>
      {shown.map((article, ind) => (
        <motion.div
          key={article._id || ind}
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <Link
            href={`/news/${slugify(article.title || '', {
              lower: true,
              strict: true,
            })}`}
            className='group cursor-pointer '
          >
            <div className='relative z-50 mb-6'>
              {/* 16:9 frame: the article covers are 16:9, so nothing of the
                  picture (or the text written on it) is cut off. */}
              <div className='aspect-video overflow-hidden bg-black'>
                <Image
                  width={800}
                  height={450}
                  src={article.image}
                  alt={article.title || 'blog'}
                  className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
              </div>
              <div className='absolute -bottom-4 z-50 right-6 bg-[#2D4A68] backdrop-blur-sm px-3 py-1 flex items-center gap-1'>
                <span className='text-sm text-white'>
                  {article.date}
                </span>
              </div>
            </div>
            <div className='shadow-xl px-5'>
              <div className='flex items-center mb-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-[#2B3674]'>
                    by {article.author}
                  </span>
                </div>
              </div>
              <h3 className='lg:text-2xl md:text-xl text-2xl font-bold text-black mb-3'>
                {article.title}
              </h3>
              <button className=' mb-8 mt-2 text-[#737373] hover:text-buttonColor transition-colors'>
                Read More
              </button>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );

  if (compact) {
    return (
      <section className='bg-white pt-14 md:pt-20'>
        <div className='max-w-7xl m-auto px-4 sm:px-6 lg:px-20'>
          <div className='flex flex-wrap items-end justify-between gap-4 mb-10'>
            <h2 className='text-2xl md:text-5xl text-[#2B3674]'>{title}</h2>
            <Link href='/news' className='text-[15px] text-[#2B3674] underline underline-offset-4 hover:text-black'>
              All articles
            </Link>
          </div>
          {cards}
        </div>
      </section>
    );
  }

  return (
    <div className='relative'>
      <div className='bg-[#F8F8F8] text-center md:h-[300px] sm:h-[230px] h-[170px] sm:pt-20 pt-8'>
        <h2 className='text-2xl md:text-5xl max-w-xl m-auto text-[#2B3674] mb-2 px-4'>
          {title}
        </h2>
      </div>
      <div className='sm:-mt-32 -mt-28'>
        <div className='max-w-7xl m-auto px-4 sm:px-6 lg:px-20 pt-16'>
          {cards}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
