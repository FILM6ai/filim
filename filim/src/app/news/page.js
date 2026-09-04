"use client";
import Hero from "@/components/Home/Hero";
import React, { useEffect, useState } from "react";
import BlogsNews from "@/components/News/BlogsNews";
import axios from "axios";
import Loading from "@/components/faq/Loading";
import { API_BASE_URL } from "@/utils/backend";
import VideoPlayer from "@/components/Home/VideoPlayer";

const page = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [alt, setAlt] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState({});

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
          setVideo(homeData.videos || {});
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

  // The player hides itself when there is no source, but the grid has to know
  // beforehand whether to split, so ask the same question here.
  const hasVideo = Boolean(
    video?.youtubeUrl || (video?.videoUrls && video.videoUrls.length > 0),
  );

  return (
    <div>
      <Hero
        image={[{ type: "video", value: image }]}
        title1={title}
        alt={alt}
        description={description}
      />
      {/* This page's header runs straight into the article grid, so the video
          goes after the first six articles rather than on top of the list. The
          slot is null when nothing is set, and the grid then renders as one
          uninterrupted run. */}
      <BlogsNews
        videoAfter={9}
        videoSlot={
          hasVideo ? (
            <VideoPlayer
              video={video?.videoUrls}
              title={video?.title}
              description={video?.description}
              youtubeUrl={video?.youtubeUrl}
            />
          ) : null
        }
      />
      {/* AlphaAct-One */}
    </div>
  );
};

export default page;
