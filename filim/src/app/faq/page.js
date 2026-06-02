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
        const hero = data.faqData[0].faqhero || {};
        // Normalize hero data: prefer youtubeUrl, otherwise detect if bgImage is video or image
        const heroDataNormalized = {
          ...hero,
        };
        setHeroData(heroDataNormalized);
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
        image={(() => {
          const arr = [];
          if (heroData?.youtubeUrl) {
            // convert to embed URL if needed
            const u = heroData.youtubeUrl;
            let embed = u;
            if (u.includes('watch')) {
              const v = new URL(u).searchParams.get('v');
              if (v) embed = `https://www.youtube.com/embed/${v}`;
            } else if (u.includes('youtu.be')) {
              const v = u.split('/').pop();
              embed = `https://www.youtube.com/embed/${v}`;
            }
            arr.push({ type: 'youtube', value: embed });
          } else if (heroData?.bgImage) {
            const url = heroData.bgImage;
            const isVideo = url && (url.endsWith('.mp4') || url.includes('video'));
            arr.push({ type: isVideo ? 'video' : 'image', value: url });
          }
          return arr.length ? arr : [{ type: 'image', value: '' }];
        })()}
        title1={heroData?.title}
        description={heroData?.description}
      />

      <Faqs faqs={advanceData} />
    </div>
  );
};

export default page;
