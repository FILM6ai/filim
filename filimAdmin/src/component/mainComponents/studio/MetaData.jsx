'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MetaData = () => {
  // State for the studio meta data.
  const [metaData, setMetaData] = useState({
    page: 'studio',
    title: '',
    description: '',
  });
  // To hold the document's ID if it exists.
  const [metaId, setMetaId] = useState(null);
  // For loading state during form submission.
  const [loading, setLoading] = useState(false);

  // Fetch the meta data when the component mounts.
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getmetadata`
        );
        console.log(response, 'response metadata');
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          // Extract studio metadata from the returned document.
          const meta = response.data.data[0];
          setMetaData({
            page: 'studio',
            title: meta.studio.title,
            description: meta.studio.description,
          });
          setMetaId(meta._id);
        }
      } catch (error) {
        console.error('Error fetching meta data:', error);
      }
    };

    fetchMetaData();
  }, []);

  // Update state when inputs change.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetaData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form: update if metaId exists, otherwise create.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (metaId) {
        // Update existing meta data record.
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updatemetaData/${metaId}`,
          metaData
        );
      } else {
        // Create a new meta data record.
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/postmetaData`,
          metaData
        );
        console.log(response, 'response post data');
        if (response.data && response.data.data) {
          setMetaId(response.data.data._id);
        }
      }
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error submitting meta data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mb-20 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>Meta Data Form</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-1'>Title:</label>
          <input
            type='text'
            name='title'
            value={metaData.title}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-1'>
            Description:
          </label>
          <textarea
            name='description'
            value={metaData.description}
            onChange={handleChange}
            rows='4'
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='w-full cursor-pointer bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50'
        >
          {loading ? 'Saving...' : metaId ? 'Update' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default MetaData;
