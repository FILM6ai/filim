'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [selectedFaqId, setSelectedFaqId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all FAQs on component mount
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/faq/faqgetroute`
        );
        setFaqs(data.faqData || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        toast.error('Error fetching FAQs');
      }
    };

    fetchFaqs();
  }, []);

  // Populate form with selected FAQ details for update
  const handleSelectFaq = (faq) => {
    setSelectedFaqId(faq._id);
    setTitle(faq.faq?.title || '');
    setDescription(faq.faq?.description || '');
  };

  // Reset form for creating a new FAQ
  const handleNewFaq = () => {
    setSelectedFaqId(null);
    setTitle('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const faqPayload = { title, description };
      let response;

      if (selectedFaqId) {
        // Update existing FAQ
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/faq/faqupdateroute/${selectedFaqId}`,
          faqPayload
        );
        toast.success('FAQ updated successfully!');
      } else {
        // Create a new FAQ
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/faq/faqpostroute`,
          faqPayload
        );
        toast.success('FAQ created successfully!');
      }
      console.log('Response:', response.data);

      // Refresh FAQ list after submission
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/faq/faqgetroute`
      );
      setFaqs(data.faqData || []);
      handleNewFaq(); // Reset form after update/create
    } catch (error) {
      console.error('Error submitting FAQ:', error);
      toast.error('Error submitting FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='mt-4 mb-12 text-center text-3xl font-semibold'>
        FAQ Management
      </h1>
      <div className=' flex-col md:flex-row gap-4'>
        {/* FAQ Form */}
        <div className='p-4 border'>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-black mb-1'>Title</label>
              <input
                type='text'
                placeholder='Title'
                className='border border-black px-3 py-2 mt-2 outline-0 w-full'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name='title'
              />
            </div>

            <div className='mb-4'>
              <label className='block text-black mb-1'>Description</label>
              <textarea
                placeholder='Description'
                className='border border-black px-3 py-2 mt-2 outline-0 w-full'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                name='description'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
        {/* FAQ List */}
        <div className=' mt-12 p-4 border'>
          <h2 className='text-xl font-semibold mb-4'>FAQ List</h2>
          {faqs.length === 0 ? (
            <p>No FAQs available</p>
          ) : (
            <ul>
              {faqs.map((faq) => (
                <li key={faq._id} className='mb-2'>
                  <button
                    type='button'
                    onClick={() => handleSelectFaq(faq)}
                    className='text-blue-500 hover:underline cursor-pointer '
                  >
                    {faq.faq?.title || 'Untitled FAQ'}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={handleNewFaq}
            className='mt-4 bg-green-500 text-white px-4 py-2 rounded cursor-pointer'
          >
            Create New FAQ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Faq;
