'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import slugify from 'slugify';


const Blogs = () => {
  
  const [bloges, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/getblog`
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

  if (!bloges.length) {
    return (
      <div className='text-center text-3xl text-red-600 pb-12'>
        No blogs found.
      </div>
    );
  }

  return (
    <div className='relative'>
      <div className='bg-[#F8F8F8] text-center md:h-[300px] sm:h-[230px] h-[170px] sm:pt-20 pt-8'>
        <h1 className='text-2xl md:text-5xl max-w-xl m-auto text-[#2B3674] mb-2 px-4'>
          Latest News & Articles From The Post
        </h1>
      </div>
      <div className='sm:-mt-32 -mt-28'>
        <div className='max-w-7xl m-auto px-4 sm:px-6 lg:px-20 pt-16'>
          <div className='relative  z-10 mb-12 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-8'>
            {[...bloges]
              .slice(0, 6)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((article, ind) => (
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
                      <Image
                        width={500}
                        height={500}
                        src={article.image}
                        alt={article.title || 'blog'}
                        className='w-full max-h-[160px] object-cover transition-transform duration-300 group-hover:scale-105'
                      />
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
        </div>
      </div>
    </div>
  );
};

export default Blogs;
