'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';


const FestivalForm = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Submitted:', form);
    // Add your submission logic here
  };

  return (
    <motion.div initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{
      duration: 0.6,
      ease: 'easeOut',
    }} className='min-h-screen bg-gray-100 flex items-center justify-center pt-10 pb-10'>
      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-lg max-md:p-4 p-8 rounded-lg w-full max-w-3xl'
      >
        <h2 className='text-2xl font-semibold mb-6 text-center'>Contact Us</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div>
            <label className='block mb-1 text-sm font-medium'>First Name</label>
            <input
              type='text'
              name='firstName'
              value={form.firstName}
              onChange={handleChange}
              className='w-full border border-black px-4 py-2 rounded-md'
              required
            />
          </div>

          <div>
            <label className='block mb-1 text-sm font-medium'>Last Name</label>
            <input
              type='text'
              name='lastName'
              value={form.lastName}
              onChange={handleChange}
              className='w-full border border-black px-4 py-2 rounded-md'
              required
            />
          </div>

          <div>
            <label className='block mb-1 text-sm font-medium'>Email</label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              className='w-full border border-black px-4 py-2 rounded-md'
              required
            />
          </div>

          <div>
            <label className='block mb-1 text-sm font-medium'>Phone</label>
            <input
              type='tel'
              name='phone'
              value={form.phone}
              onChange={handleChange}
              className='w-full border border-black px-4 py-2 rounded-md'
            />
          </div>
        </div>

        <div className='mb-4'>
          <label className='block mb-1 text-sm font-medium'>Select Topic</label>
          <select
            name='topic'
            value={form.topic}
            onChange={handleChange}
            className='w-full border border-black px-4 py-2 rounded-md bg-white'
            required
          >
            <option value=''>Select a topic</option>
            <option value='feedback'>Feedback</option>
            <option value='support'>Support</option>
            <option value='general'>General Inquiry</option>
          </select>
        </div>

        <div className='mb-6'>
          <label className='block mb-1 text-sm font-medium'>Message</label>
          <textarea
            name='message'
            rows='5'
            value={form.message}
            onChange={handleChange}
            className='w-full border border-black px-4 py-2 rounded-md bg-white'
            required
          ></textarea>
        </div>

        <button
          type='submit'
          className='w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition'
        >
          Submit
        </button>
      </form>
    </motion.div>
  );
};

export default FestivalForm;
