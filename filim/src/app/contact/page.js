'use client'
import Hero from '@/components/Home/Hero';
import React, { useEffect, useState } from 'react';
import Advancing from '@/components/Home/Advancing';
import Form from '@/components/Contact/Form';
import ContactParah from '@/components/Home/ContactParah';
import axios from 'axios';
import Loading from '@/components/faq/Loading';
import { API_BASE_URL } from "@/utils/backend";

const page = () => {
  const [heroData, setHeroData] = useState({});
  const [advanceData, setAdvanceData] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/contact/getcontact`
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

  if (loading) return <Loading />; 
  
  return (
    <div>
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
