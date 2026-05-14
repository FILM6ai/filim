'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Terms from '@/components/faq/Terms';
import Head from 'next/head';

const TermsPage = () => {

    const [metaData, setMetaData] = useState({
      page: 'terms',
      title: '',
      description: '',
    });

    useEffect(() => {
      const fetchMetaData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/getmetadata`
          );
          if (
            response.data &&
            response.data.data &&
            response.data.data.length > 0
          ) {
            const meta = response.data.data[0];
            setMetaData({
              page: 'terms',
              title: meta.terms.title,
              description: meta.terms.description,
            });
          }
        } catch (error) {
          console.error('Error fetching meta data:', error);
        }
      };

      fetchMetaData();
    }, []);




  return (
    <div>
      <Head>
        <title>{metaData.title || 'Blog Details'}</title>
        <meta name='description' content={metaData.description} />
      </Head>
      <Terms />
    </div>
  );
};

export default TermsPage;
