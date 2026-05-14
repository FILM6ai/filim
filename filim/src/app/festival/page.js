"use client";
import Hero from "@/components/Home/Hero";
import React, { useEffect, useState } from "react";
import Advancing from "@/components/Home/Advancing";
import TopListing from "@/components/Home/TopListing";
import Robot from "@/components/Home/Robot";
import Runway from "@/components/Home/Runway";
import axios from "axios";
import Head from "next/head";
import Loading from "@/components/faq/Loading";
import Sheilds from "@/components/Home/Sheilds";

const page = () => {
  const [heroData, setHeroData] = useState({});
  const [advanceData, setAdvanceData] = useState({});
  const [toplist, setToplist] = useState({});
  const [robot, setRobot] = useState({});
  const [competate, setCompetate] = useState({});
  const [runway, setRunway] = useState({});
  const [shieldMainTitle, setShieldMainTitle] = useState("");
  const [shieldCards, setShieldCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState({
    page: "festival",
    title: "",
    description: "",
  });
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/festival/getfestival`,
        );
        setHeroData(data.festival[0].hero);
        setAdvanceData(data.festival[0].advance);
        setToplist(data.festival[0].toplist);
        setRobot(data.festival[0].robot);
        setCompetate(data.festival[0].competate);
        setRunway(data.festival[0].runway);
        setShieldMainTitle(data.festival[0].cardSection.mainTitle || "");
        setShieldCards(data.festival[0].cardSection.cards || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // METADATA

  useEffect(() => {
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
            page: "festival",
            title: meta.festival.title,
            description: meta.festival.description,
          });
        }
      } catch (error) {}
    };
    fetchMetaData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <Head>
        <title>{metaData.title || "Blog Details"}</title>
        <meta name="description" content={metaData.description} />
      </Head>
      <Hero
        image={[{ type: "video", value: heroData?.bgImage }]}
        title1={heroData?.title}
        alt={heroData?.alt}
        description={heroData?.description}
      />
      <Advancing
        title1={advanceData?.title}
        title2={advanceData?.title2}
        description={advanceData?.description}
        image={advanceData?.bgImage}
        color="bg-[#F8F8F8]"
        alt={advanceData?.alt}
      />
      <TopListing
        title={toplist?.title}
        description={toplist?.description}
        image={
          Array.isArray(toplist?.bgImage) && toplist.bgImage.length > 0
            ? toplist.bgImage[toplist.bgImage.length - 1]
            : toplist?.bgImage
        }
        button={toplist?.button}
        alt={toplist?.alt}
        link={toplist?.link}
      />
      <Robot
        title={robot?.title}
        description={robot?.description}
        image={
          Array.isArray(robot?.bgImage) && robot.bgImage.length > 0
            ? robot.bgImage[robot.bgImage.length - 1]
            : robot?.bgImage
        }
        button={robot?.button}
        alt={robot?.alt}
        link={robot?.link}
      />
      <div>
        <TopListing
          title={competate?.title}
          description={competate?.description}
          image={
            Array.isArray(competate?.bgImage) && competate.bgImage.length > 0
              ? competate.bgImage[competate.bgImage.length - 1]
              : competate?.bgImage
          }
          button={competate?.button}
          order="reverse"
          alt={competate?.alt}
          link={competate?.link}
        />
        <div className="bg-[#F8F8F8] max-md:mt-12 md:h-48 md:-mt-16 relative -z-50"></div>
      </div>
      <Sheilds mainTitle={shieldMainTitle} cards={shieldCards} />
      <Runway
        title={runway?.title}
        image={
          Array.isArray(runway?.bgImage) && runway.bgImage.length > 0
            ? runway.bgImage[runway.bgImage.length - 1]
            : runway?.bgImage
        }
        button={runway?.button}
        alt={runway?.alt}
        link={runway?.link}
      />
    </div>
  );
};

export default page;
