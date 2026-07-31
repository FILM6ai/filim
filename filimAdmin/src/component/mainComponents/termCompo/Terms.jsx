
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

const Terms = () => {
  const [content, setContent] = useState('');
  const [termId, setTermId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [QuillEditor, setQuillEditor] = useState(null);

  // Dynamically import ReactQuill only on client side
  useEffect(() => {
    const loadEditor = async () => {
      const ReactQuill = (await import('react-quill-new')).default;
      setQuillEditor(() => ReactQuill);
    };
    loadEditor();
  }, []);

  // Fetch the terms content on component mount
  useEffect(() => {
    const fetchTerm = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/term/getterm`
        );
        if (data.termData && data.termData.length > 0) {
          const term = data.termData[0];
          setTermId(term._id);
          setContent(term.content || '');
        }
      } catch (error) {
        console.error('Error fetching terms:', error);
        toast.error('Error fetching terms');
      }
    };

    fetchTerm();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (termId) {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/term/updateterm/${termId}`,
          { content }
        );
        toast.success('Terms updated successfully!');
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/term/postterm`,
          { content }
        );
        toast.success('Terms created successfully!');
        setTermId(response.data.termData._id);
      }
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error submitting terms:', error);
      toast.error('Error submitting terms');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='py-20 px-4'>
      <h1 className='text-2xl font-semibold text-black'>Terms & Conditions</h1>
      <div className='pt-4'>
        {QuillEditor ? (
          <QuillEditor
            theme='snow'
            value={content}
            onChange={setContent}
            placeholder='Write something amazing...'
          />
        ) : (
          <p className='text-center text-2xl text-red-500 py-20'>Loading editor...</p>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className='mt-6 bg-blue-500 text-white px-8 cursor-pointer py-2 rounded'
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default Terms;

