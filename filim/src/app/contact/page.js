'use client'
import Hero from '@/components/Home/Hero';
import React, { useEffect, useState } from 'react';
import Advancing from '@/components/Home/Advancing';
import Form from '@/components/Contact/Form';
import ContactParah from '@/components/Home/ContactParah';
import axios from 'axios';
import Head from 'next/head';
import Loading from '@/components/faq/Loading';

const page = () => {
  const [heroData, setHeroData] = useState({});
  const [advanceData, setAdvanceData] = useState({});
const [loading, setLoading] = useState(true);
  
    const [metaData, setMetaData] = useState({
      page: 'contact',
      title: '',
      description: '',
    });
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact/getcontact`
        );
        
        setHeroData(data.contact[0].hero);
        setAdvanceData(data.contact[0].advance);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching hero data:', error);
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

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
            page: 'contact',
            title: meta.contact.title,
            description: meta.contact.description,
          });
        }
      } catch (error) {
      }
    };

    fetchMetaData();
  }, []);

    if (loading) return <Loading />; 
  
  return (
    <div>
      <Head>
        <title>{metaData.title || 'Blog Details'}</title>
        <meta name='description' content={metaData.description} />
      </Head>
      <Hero
        image={[{ type: 'video', value: heroData?.bgImage }]}
        title1={heroData?.title || 'Contact Us'}
        alt={heroData?.alt}
        description={heroData?.description}
      />
      <Advancing title1={advanceData?.title || 'have a question?'} />
      <ContactParah description={advanceData?.description} />
      <Form />
    </div>
  );
};

export default page;
