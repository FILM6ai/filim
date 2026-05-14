'use client';
import Faqs from '@/components/faq/Faqs';
import Loading from '@/components/faq/Loading';
import Hero from '@/components/Home/Hero';
import axios from 'axios';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

const page = () => {
  const [heroData, setHeroData] = useState({});
  const [advanceData, setAdvanceData] = useState([]);
  const [loading, setLoading] = useState(true);
    const [metaData, setMetaData] = useState({
      page: 'faq',
      title: '',
      description: '',
    });
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/faq/faqgetroute`
        );

        setHeroData(data.faqData[0].faqhero);
        const allFaqs = data.faqData.map((item) => item.faq);
        setAdvanceData(allFaqs);
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
            page: 'faq',
            title: meta.faq.title,
            description: meta.faq.description,
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
        title1={heroData?.title}
        description={heroData?.description}
      />

      <Faqs faqs={advanceData} />
    </div>
  );
};

export default page;
