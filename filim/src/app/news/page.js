"use client";
import Hero from "@/components/Home/Hero";
import React, { useEffect, useState } from "react";
import BlogsNews from "@/components/News/BlogsNews";
import axios from "axios";
import Head from "next/head";
import Loading from "@/components/faq/Loading";

const page = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [alt, setAlt] = useState("");
  const [description, setDescription] = useState("");
  const [metaData, setMetaData] = useState({
    page: "news",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch existing news data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/news/getnews`,
        );
        const homeData = data.news[0];
        if (homeData) {
          setTitle(homeData.title || "");
          setImage(homeData.bgImage || "");
          setAlt(homeData.alt || "");
          setDescription(homeData.description || "");
        }
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            page: "news",
            title: meta.news.title,
            description: meta.news.description,
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
        image={[{ type: "video", value: image }]}
        title1={title}
        alt={alt}
        description={description}
      />
      <BlogsNews />
      {/* AlphaAct-One */}
    </div>
  );
};

export default page;
