"use client";
import Hero from "@/components/Home/Hero";
import React, { useEffect, useState } from "react";
import BlogsNews from "@/components/News/BlogsNews";
import axios from "axios";
import Loading from "@/components/faq/Loading";
import { API_BASE_URL } from "@/utils/backend";

const page = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [alt, setAlt] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch existing news data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/news/getnews`,
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

  if (loading) return <Loading />;

  return (
    <div>
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
