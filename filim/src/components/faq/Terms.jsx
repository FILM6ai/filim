'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Terms = () => {
    
      const [termData, setTermData] = useState(null);
      const [loading, setLoading] = useState(true);
      useEffect(() => {
        const fetchTermData = async () => {
          try {
            const { data } = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/term/getterm`
            );
            console.log(data.termData[0], 'terms data');

            // Adjust based on your API response structure
            if (data.success && data.termData) {
              setTermData(data.termData[0]);
            }
          } catch (error) {
            console.error('Error fetching term data:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchTermData();
      }, []);

      if (loading) {
        return <div className='py-32 text-center '>Loading...</div>;
      }
  return (
    <div className=' text-start flex flex-col items-start py-32 px-8'>
      <h1 className='pb-12 text-2xl font-semibold font-sans '>Terms and Conditions Page</h1>
      {termData ? (
        <div className='font-sans' dangerouslySetInnerHTML={{ __html: termData.content }} />
      ) : (
        <p>No terms available.</p>
      )}
    </div>
  );
}

export default Terms