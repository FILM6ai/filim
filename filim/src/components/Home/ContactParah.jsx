'use client'
import React from 'react'
import { motion } from 'framer-motion';
const ContactParah = ({ description }) => {
  return (
    <div>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <p className='px-4 sm:px-6 lg:px-20 text-xl max-w-6xl m-auto pt-1 text-center'>
          {description}
        </p>
      </motion.div>
    </div>
  );
};

export default ContactParah