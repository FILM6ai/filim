"use client";
import Hero from "@/components/Home/Hero";
import TopListing from "@/components/Home/TopListing";
import React, { useEffect, useState } from "react";
import Advancing from "@/components/Home/Advancing";
import axios from "axios";
import Head from "next/head";
import Loading from "@/components/faq/Loading";
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import CategoriesFestival from "@/components/Home/CategoriesFestival";
// loading
const page = () => {
  const [heroData, setHeroData] = useState({});
  const [advanceData, setAdvanceData] = useState({});
  const [toplist, setToplist] = useState({});
  const [robot, setRobot] = useState({});
  const [competate, setCompetate] = useState({});
  const [runway, setRunway] = useState({});
  const [toplist3, setToplist3] = useState({});
  const [competate3, setCompetate3] = useState({});
  const [card1, setCard1] = useState({});
  const [card2, setCard2] = useState({});
  const [card3, setCard3] = useState({});
  const [card4, setCard4] = useState({});
  const [card5, setCard5] = useState({});
  const [card6, setCard6] = useState({});
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState({
    page: "studio",
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/studio/getstudio`,
        );
        setHeroData(data.studio[0].hero);
        setAdvanceData(data.studio[0].advance);
        setToplist(data.studio[0].toplist);
        setRobot(data.studio[0].competate);
        setCompetate(data.studio[0].toplist2);
        setRunway(data.studio[0].competate2);
        setToplist3(data.studio[0].toplist3);
        setCompetate3(data.studio[0].competate3);
        setCard1(data.studio[0].card1);
        setCard2(data.studio[0].card2);
        setCard3(data.studio[0].card3);
        setCard4(data.studio[0].card4);
        setCard5(data.studio[0].card5);
        setCard6(data.studio[0].card6);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const fetchMetaData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getmetadata`,
      );
      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        const meta = response.data.data[0];
        setMetaData({
          page: "studio",
          title: meta.studio.title,
          description: meta.studio.description,
        });
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchMetaData();
  }, [metaData]);

  if (loading) return <Loading />;

  return (
    <div>
      <Head>
        <title>{metaData.title || "Blog Details"}</title>
        <meta name="description" content={metaData.description} />
      </Head>
      <Hero
        image={
          heroData?.bgImage?.map((video) => ({
            type: "video",
            value: video,
          })) || []
        }
        title1={heroData.title}
        alt={heroData.alt}
        description={heroData.description}
        // arrowLeft={FaArrowLeft}
        // arrowRight={FaArrowRight}
      />
      <Advancing
        title1={advanceData?.title}
        title2={advanceData?.title2}
        description={advanceData?.description}
      />
      {/* <CardsSection /> */}
      {/* <div className=' '>
          <CategoriesFestival
          title={card1?.mainTitle}
            description={card1?.description}
            img={card1?.catogryImage}
          />
          <CategoriesFestival
            description={card2?.description}
            img={card2?.catogryImage}
          />
          <CategoriesFestival
            description={card3?.description}
            img={card3?.catogryImage}
          />
          <CategoriesFestival
            description={card4?.description}
            img={card4?.catogryImage}
          />
          <CategoriesFestival
            description={card5?.description}
            img={card5?.catogryImage}
          />
          <CategoriesFestival
            description={card6?.description}
            img={card6?.catogryImage}
          />
        </div> */}
      <section className="bg-black text-white py-12 px-4 sm:px-6 lg:px-20 mt-10">
        {/* Title OUTSIDE the grid */}
        <h1 className="text-3xl font-medium text-center mb-12">
          {card1?.mainTitle}
        </h1>

        {/* Grid of all cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[card1, card2, card3, card4, card5, card6].map((card, index) => (
            <CategoriesFestival
              key={index}
              description={card.description}
              img={card.catogryImage}
              youtubeUrl={card.youtubeUrl}
              index={index}
            />
          ))}
        </div>
      </section>

      <TopListing
        title={toplist?.title}
        description={toplist?.description}
        image={Array.isArray(toplist?.bgImage) && toplist.bgImage.length > 0 ? toplist.bgImage[toplist.bgImage.length - 1] : toplist?.bgImage}
        button={toplist?.button}
        genere={toplist?.genre}
        line={toplist?.line}
        description2={toplist?.description2}
        height="height"
        bgColor="color"
        alt={toplist?.alt}
        link={toplist?.link}
        youtubeUrl={toplist?.youtubeUrl}
      />
      <div className="md:mt-32">
        <TopListing
          title={robot?.title}
          description={robot?.description}
          image={Array.isArray(robot?.bgImage) && robot.bgImage.length > 0 ? robot.bgImage[robot.bgImage.length - 1] : robot?.bgImage}
          button={robot?.button}
          genere={robot?.genre}
          description2={robot?.description2}
          order="reverse"
          height="height"
          bgColor="color"
          alt={robot?.alt}
          link={robot?.link}
          youtubeUrl={robot?.youtubeUrl}
        />
      </div>
      <div className="md:mt-32">
        <TopListing
          title={competate?.title}
          description={competate?.description}
          image={Array.isArray(competate?.bgImage) && competate.bgImage.length > 0 ? competate.bgImage[competate.bgImage.length - 1] : competate?.bgImage}
          button={competate?.button}
          genere={competate?.genre}
          line={competate?.line}
          description2={competate?.description2}
          height="height"
          bgColor="color"
          alt={competate?.alt}
          link={competate?.link}
          youtubeUrl={competate?.youtubeUrl}
        />
      </div>

      <div className="md:mt-32 ">
        <TopListing
          title={runway?.title}
          description={runway?.description}
          image={Array.isArray(runway?.bgImage) && runway.bgImage.length > 0 ? runway.bgImage[runway.bgImage.length - 1] : runway?.bgImage}
          button={runway?.button}
          genere={runway?.genre}
          description2={runway?.description2}
          order="reverse"
          height="height"
          bgColor="color"
          alt={runway?.alt}
          link={runway?.link}
          youtubeUrl={runway?.youtubeUrl}
        />
      </div>
      <div className="md:mt-32 ">
        <TopListing
          title={toplist3?.title}
          description={toplist3?.description}
          image={Array.isArray(toplist3?.bgImage) && toplist3.bgImage.length > 0 ? toplist3.bgImage[toplist3.bgImage.length - 1] : toplist3?.bgImage}
          button={toplist3?.button}
          genere={toplist3?.genre}
          line={toplist3?.line}
          description2={toplist3?.description2}
          height="height"
          bgColor="color"
          alt={toplist3?.alt}
          link={toplist3?.link}
          youtubeUrl={toplist3?.youtubeUrl}
        />
      </div>
      <div className="md:mt-32 md:mb-40 max-sm:mb-16">
        <TopListing
          title={competate3?.title}
          description={competate3?.description}
          image={Array.isArray(competate3?.bgImage) && competate3.bgImage.length > 0 ? competate3.bgImage[competate3.bgImage.length - 1] : competate3?.bgImage}
          button={competate3?.button}
          genere={competate3?.genre}
          description2={competate3?.description2}
          order="reverse"
          height="height"
          bgColor="color"
          alt={competate3?.alt}
          link={competate3?.link}
          youtubeUrl={competate3?.youtubeUrl}
        />
      </div>
    </div>
  );
};

export default page;
