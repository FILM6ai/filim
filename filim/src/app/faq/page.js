'use client';
import Faqs from '@/components/faq/Faqs';
import Loading from '@/components/faq/Loading';
import Hero from '@/components/Home/Hero';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from "@/utils/backend";

const page = () => {
  const [heroData, setHeroData] = useState({});
  const [advanceData, setAdvanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/faq/faqgetroute`
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

  if (loading) return <Loading />; 

  return (
    <div>
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
