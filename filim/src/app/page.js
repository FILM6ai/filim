'use client';
import { useEffect, useState } from 'react';
import Advancing from '@/components/Home/Advancing';
import Robot from '@/components/Home/Robot';
import TopListing from '@/components/Home/TopListing';
import Runway from '@/components/Home/Runway';
import Blogs from '@/components/Home/Blogs';
import Hero from '@/components/Home/Hero';
import Loading from '../components/faq/Loading'
import axios from 'axios';
import Head from 'next/head';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import VideoPlayer from '@/components/Home/VideoPlayer';
// why its not working


export default function Home() {
  const [heroData, setHeroData] = useState({});
  const [advanceData, setAdvanceData] = useState({});
  const [toplist, setToplist] = useState({});
  const [robot, setRobot] = useState({});
  const [competate, setCompetate] = useState({});
  const [runway, setRunway] = useState({});
  const [metaData, setMetaData] = useState({
    page: 'home',
    title: '',
    description: '',
  });
  const [video, setVideo] = useState({})
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/home/gethome`
        );
        console.log(data.home[0].hero, 'hero');
        console.log(data.home[0].hero.bgImage, 'bgImage array check');


        setHeroData(data.home[0].hero);
        setAdvanceData(data.home[0].advance);
        setToplist(data.home[0].toplist);
        setRobot(data.home[0].robot);
        setCompetate(data.home[0].competate);
        setRunway(data.home[0].runway);
        setVideo(data.home[0].videos);
        console.log(data.home[0].hero, 'data hero');
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
          console.log(response.data.data[0], 'meta data response home');

          setMetaData({
            page: 'home',
            title: meta.home.title,
            description: meta.home.description,
          });
        }
      } catch (error) {
        console.error('Error fetching meta data:', error);
      }
    };

    fetchMetaData();
  }, []);

  console.log(metaData, 'metaData log ');


  if (loading) return <Loading />;

  return (
    <div>
      <Head>
        <title>{metaData.title || 'Film6.ai'}</title>
        <meta name='description' content={metaData.description} />
      </Head>

      <Hero
        height='height'
        // image={[{ type: 'video', value: heroData?.bgImage }]}
        image={
          heroData?.bgImage?.map((url) => ({
            type: url.includes('youtube.com/embed') ? 'youtube' : 'video',
            value: url.includes('youtube.com/embed') && !url.includes('enablejsapi')
              ? url + '&enablejsapi=1'
              : url,
          })) || []
        }
        title1={heroData?.title}
        description={heroData?.description}
        button={heroData?.button}
        alt={heroData.alt}
        link={heroData.link}
      // arrowLeft={FaArrowLeft}
      // arrowRight={FaArrowRight}
      />
      <Advancing
        title1={advanceData?.title}
        title2={advanceData?.title2}
        description={advanceData?.description}
        image={advanceData?.bgImage}
        color='bg-[#F8F8F8]'
        alt={advanceData?.alt}
      />
      <TopListing
        title={toplist?.title}
        description={toplist?.description}
        image={toplist.bgImage}
        button={toplist?.button}
        alt={toplist?.alt}
        link={toplist?.link}
      />
      <VideoPlayer
        video={
          Array.isArray(video?.videoUrls)
            ? video.videoUrls[video.videoUrls.length - 1]
            : video?.videoUrls
        }
        title={video?.title}
        description={video?.description}
        youtubeUrl={video?.youtubeUrl}
      />

      <Robot
        title={robot?.title}
        description={robot?.description}
        image={robot.bgImage}
        button={robot?.button}
        alt={robot?.alt}
        link={robot?.link}
      />
      <TopListing
        title={competate?.title}
        description={competate?.description}
        image={competate?.bgImage}
        button={competate?.button}
        order='reverse'
        alt={competate?.alt}
        link={competate?.link}
      />
      <Runway
        title={runway?.title}
        image={runway?.bgImage}
        button={runway?.button}
        margin='mt-0'
        alt={runway?.alt}
        link={runway?.link}
      />

      <Blogs />
    </div>
  );
}
