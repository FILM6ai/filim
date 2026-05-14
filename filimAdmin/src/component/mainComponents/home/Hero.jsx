"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Advancing from "./Advancing";
import TopListing from "./TopListing";
import Robot from "./Robot";
import Competition from "./Competition";
import Runway from "./Runway";
import { jsxs } from "react/jsx-runtime";
import { validateFile } from "@/utils/fileValidation";

const Hero = () => {
  // Hero section states including the new alt state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [button, setButton] = useState("");
  const [alt, setAlt] = useState("");
  const [link, setLink] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [newYoutubeUrls, setNewYoutubeUrls] = useState([]);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Other section states
  const [advance, setAdvance] = useState({
    title: "",
    title2: "",
    description: "",
    alt: "",
  });
  const [advanceImage, setAdvanceImage] = useState(null);

  const [toplist, setToplist] = useState({
    title: "",
    description: "",
    button: "",
    alt: "",
    link: "",
  });
  const [toplistImage, setToplistImage] = useState(null);

  const [robot, setRobot] = useState({
    title: "",
    description: "",
    button: "",
    alt: "",
    link: "",
  });
  const [robotImage, setRobotImage] = useState(null);

  const [competate, setCompetate] = useState({
    title: "",
    button: "",
    alt: "",
    description: "",
    link: "",
  });
  const [competateImage, setCompetateImage] = useState(null);

  const [runway, setRunway] = useState({
    title: "",
    button: "",
    alt: "",
    link: "",
  });
  const [runwayImage, setRunwayImage] = useState(null);
  const [videos, setVideos] = useState([]);
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");
  const [newYoutubeVideoUrls, setNewYoutubeVideoUrls] = useState([]);
  const [videoData, setVideoData] = useState("");
  const [videoData2, setVideoData2] = useState("");
  // Home ID to determine whether to create or update the home page data
  const [homeId, setHomeId] = useState(null);
  // Old images states (jo already backend pe saved hain)
  const [oldHeroImages, setOldHeroImages] = useState([]);
  const [oldAdvanceImage, setOldAdvanceImage] = useState([]);
  const [oldToplistImage, setOldToplistImage] = useState([]);
  const [oldRobotImage, setOldRobotImage] = useState([]);
  const [oldCompetateImage, setOldCompetateImage] = useState([]);
  const [oldRunwayImage, setOldRunwayImage] = useState([]);
  const [oldVideo, setOldVideo] = useState([]);
  const [oldYoutubeUrl, setOldYoutubeUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/gethome`,
        );
        if (data.home && data.home.length > 0) {
          const homeData = data.home[0];
          console.log(homeData, "response get api hero");

          setHomeId(homeData._id);
          if (homeData?.hero) {
            setTitle(homeData.hero.title || "");
            setDescription(homeData.hero.description || "");
            setButton(homeData.hero.button || "");
            setAlt(homeData.hero.alt || "");
            setLink(homeData.hero.link || "");
            setOldHeroImages(homeData.hero.bgImage || []);
            setImage([]); // naye uploads ke liye
          }
          console.log(homeData.hero.bgImage, "response get api hero bgImage");
          if (homeData?.advance) {
            setAdvance(homeData.advance);
            setOldAdvanceImage(homeData.advance.bgImage || []);
            setAdvanceImage(null);
          }
          if (homeData?.toplist) {
            setToplist(homeData.toplist);
            setOldToplistImage(homeData.toplist.bgImage || []);
            setToplistImage(null);
          }
          if (homeData?.videos) {
            setVideoData(homeData.videos.title);
            setVideoData2(homeData.videos.description);
            const urls = homeData.videos.videoUrls;
            setOldVideo(Array.isArray(urls) ? urls : urls ? [urls] : []);
            setOldYoutubeUrl(homeData.videos.youtubeUrl || "");
            setVideos([]);
          }
          console.log(homeData.videos, "response get api hero bgImage");

          if (homeData?.robot) {
            setRobot(homeData.robot);
            setOldRobotImage(homeData.robot.bgImage || []);
            setRobotImage(null);
          }
          if (homeData?.competate) {
            setCompetate(homeData.competate);
            setOldCompetateImage(homeData.competate.bgImage || []);
            setCompetateImage(null);
          }
          if (homeData?.runway) {
            setRunway(homeData.runway);
            setOldRunwayImage(homeData.runway.bgImage || []);
            setRunwayImage(null);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, []);
  console.log(videos, "videos");

  // Function to create a new home page
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      const hero = { title, description, button, alt, link, youtubeUrls: newYoutubeUrls };
      console.log(hero, "hero");
      formData.append("hero", JSON.stringify(hero));
      formData.append("advance", JSON.stringify(advance));
      formData.append("toplist", JSON.stringify(toplist));
      formData.append("robot", JSON.stringify(robot));
      formData.append("competate", JSON.stringify(competate));
      formData.append("runway", JSON.stringify(runway));
      const videoMetaData = {
        title: videoData,
        description: videoData2,
        youtubeUrl: newYoutubeVideoUrls.length > 0
          ? newYoutubeVideoUrls[newYoutubeVideoUrls.length - 1]
          : oldYoutubeUrl || ""
      };
      formData.append("videos", JSON.stringify(videoMetaData));

      if (Array.isArray(image) && image.length > 0) {
        image.forEach((file) => {
          if (file instanceof File) {
            formData.append("heroImage", file);
          }
        });
      }

      if (Array.isArray(videos) && videos.length > 0) {
        videos.forEach(file => {
          if (file instanceof File) formData.append("videoPlayer", file);
        });
      }
      if (advanceImage) formData.append("advanceImage", advanceImage);
      if (toplistImage) formData.append("toplistImage", toplistImage);
      if (robotImage) formData.append("robotImage", robotImage);
      if (competateImage) formData.append("competateImage", competateImage);
      if (runwayImage) formData.append("runwayImage", runwayImage);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/homeRoute`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      toast.success("Home page created successfully!");
      console.log("Create Response:", response.data);
    } catch (error) {
      console.error("Error creating data:", error);
      toast.error("Error submitting data");
    } finally {
      setLoading(false);
    }
  };

  // Function to update the existing home page
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!homeId) {
      toast.error("No home page found to update.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      const hero = { title, description, button, alt, link, newYoutubeUrls };
      formData.append("hero", JSON.stringify(hero));
      formData.append("advance", JSON.stringify(advance));
      formData.append("toplist", JSON.stringify(toplist));
      formData.append("robot", JSON.stringify(robot));
      formData.append("competate", JSON.stringify(competate));
      formData.append("runway", JSON.stringify(runway));
      const videoMetaData = {
        title: videoData,
        description: videoData2,
        youtubeUrl: newYoutubeVideoUrls.length > 0
          ? newYoutubeVideoUrls[newYoutubeVideoUrls.length - 1]
          : oldYoutubeUrl || ""
      };
      formData.append("videos", JSON.stringify(videoMetaData));

      if (Array.isArray(image) && image.length > 0) {
        image.forEach((file) => {
          if (file instanceof File) {
            formData.append("heroImage", file);
          }
        });
      }

      if (Array.isArray(videos) && videos.length > 0) {
        videos.forEach(file => {
          if (file instanceof File) formData.append("videoPlayer", file);
        });
      }
      if (advanceImage) formData.append("advanceImage", advanceImage);
      if (toplistImage) formData.append("toplistImage", toplistImage);
      if (robotImage) formData.append("robotImage", robotImage);
      if (competateImage) formData.append("competateImage", competateImage);
      if (runwayImage) formData.append("runwayImage", runwayImage);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/homeupdate/${homeId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const updatedHome = response.data.home;
      if (updatedHome) {
        setOldHeroImages(updatedHome.hero?.bgImage || []);
        setImage([]);
        setNewYoutubeUrls([]);
        setYoutubeUrl("");
        setOldAdvanceImage(updatedHome.advance?.bgImage || []);
        setAdvanceImage(null);
        setOldToplistImage(updatedHome.toplist?.bgImage || []);
        setToplistImage(null);
        setOldRobotImage(updatedHome.robot?.bgImage || []);
        setRobotImage(null);
        setOldCompetateImage(updatedHome.competate?.bgImage || []);
        setCompetateImage(null);
        setOldRunwayImage(updatedHome.runway?.bgImage || []);
        setRunwayImage(null);
        const updatedUrls = updatedHome.videos?.videoUrls;
        setOldVideo(Array.isArray(updatedUrls) ? updatedUrls : updatedUrls ? [updatedUrls] : []);
        setOldYoutubeUrl(updatedHome.videos?.youtubeUrl || "");
        setVideos([]);
        setNewYoutubeVideoUrls([]);
        setYoutubeVideoUrl("");
      }
      toast.success("Home page updated successfully!");
      console.log("Update Response:", response.data);
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data");
    } finally {
      setLoading(false);
    }
  };

  console.log(image, "images array");
  console.log(videos, "videos");

  return (
    <div>
      <div className="p-4 border">
        <h1 className="mt-4 mb-12 text-center text-3xl font-semibold">
          Header
        </h1>
        <form>
          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            <label
              htmlFor="upload2"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 fill-white stroke-indigo-500"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-gray-600 font-medium">Upload file</span>
              <span className="text-xs text-gray-600">Max Size:20MB</span>
            </label>
            <input
              // onChange={(e) => setImage(Array.from(e.target.files))}
              onChange={(e) => {
                const files = Array.from(e.target.files);
                for (let file of files) {
                  const result = validateFile(file);
                  if (!result.valid) {
                    alert(result.message);
                    return;
                  }
                }
                setImage((prev) => {
                  const prevArr = Array.isArray(prev) ? prev : [];
                  return [...prevArr, ...files];
                });
              }}
              id="upload2"
              type="file"
              accept="video/*"
              multiple
              className="hidden"
            />
          </div>

          {Array.isArray(image) && image.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-green-600 mb-2">
                NEW VIDEOS (Upload Videos)
              </h2>
              <div className="flex gap-4 flex-wrap">
                {image.map((item, index) => (
                  <div key={index} className="relative">
                    <video
                      src={
                        item instanceof File ? URL.createObjectURL(item) : item
                      }
                      controls
                      className="w-36 h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* YOUTUBE URL ADD SECTION */}
          <div className="mt-6 border border-yellow-400 p-4">
            <h2 className="text-black font-semibold mb-2">
              ADD YOUTUBE VIDEO URL
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=XXXXXX"
                className="border border-black px-3 py-2 outline-0 flex-1"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <button
                type="button"
                className="bg-yellow-500 text-white px-4 py-2"
                onClick={() => {
                  const trimmed = youtubeUrl.trim();
                  if (!trimmed) return;
                  let videoId = "";

                  // Format 1: already embed URL — https://www.youtube.com/embed/XXXXX
                  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
                  // Format 2: normal URL — https://www.youtube.com/watch?v=XXXXX
                  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
                  // Format 3: short URL — https://youtu.be/XXXXX
                  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
                  // Format 4: sirf 11 character ID — dXXXXXXXXXX
                  const idOnlyMatch = trimmed.match(/^([a-zA-Z0-9_-]{11})$/);

                  if (embedMatch) videoId = embedMatch[1];
                  else if (watchMatch) videoId = watchMatch[1];
                  else if (shortMatch) videoId = shortMatch[1];
                  else if (idOnlyMatch) videoId = idOnlyMatch[1];

                  if (!videoId) {
                    alert("Valid YouTube URL nahi hai. Koi bhi YouTube URL paste karo.");
                    return;
                  }

                  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1`;
                  setNewYoutubeUrls((prev) => [...prev, embedUrl]);
                  setYoutubeUrl("");
                }}
              >
                + Add
              </button>
            </div>

            {/* Naye add kiye YouTube videos preview */}
            {newYoutubeUrls.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-green-600 mb-2">
                  NEW YOUTUBE VIDEOS (Has Saved)
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {newYoutubeUrls.map((url, i) => (
                    <div key={i} className="relative">
                      <iframe
                        src={url}
                        className="w-48 h-28"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNewYoutubeUrls((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* OLD HERO VIDEOS — NEECHE */}
          {oldHeroImages.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-500 mb-2">
                OLD VIDEOS
              </h2>
              <div className="flex gap-4 flex-wrap">
                {[...oldHeroImages].reverse().map((url, index) => (
                  <div key={index} className="relative">
                    {url.includes("youtube.com/embed") ? (
                      <iframe
                        src={url}
                        className="w-36 h-24"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    ) : (
                      <video src={url} controls className="w-36 h-auto" />
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/deleteimage/${homeId}`,
                            {
                              data: {
                                section: "hero",
                                field: "bgImage",
                                imageUrl: url,
                              },
                            },
                          );
                          setOldHeroImages((prev) =>
                            prev.filter((u) => u !== url),
                          );
                          toast.success("Video deleted!");
                        } catch {
                          toast.error("Delete failed!");
                        }
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 z-10"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text Input Fields */}
          <div className="mt-8">
            <div className="mb-4">
              <h1 className="text-black">ALT TEXT</h1>
              <input
                type="text"
                placeholder="Alt Text"
                className="border border-black px-3 py-2 mt-2 outline-0"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">TITLE</h1>
              <input
                type="text"
                placeholder="Title"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4 mt-4">
              <h1 className="text-black">DESCRIPTION</h1>
              <textarea
                placeholder="Description"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">BUTTON</h1>
              <input
                type="text"
                placeholder="Button"
                className="border border-black px-3 py-2 mt-2 outline-0"
                value={button}
                onChange={(e) => setButton(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">LINK URL</h1>
              <input
                type="text"
                placeholder="link url"
                className="border border-black px-3 py-2 mt-2 outline-0"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
      {/* Render other section components */}
      <Advancing
        advance={advance}
        setAdvance={setAdvance}
        advanceImage={advanceImage}
        setAdvanceImage={setAdvanceImage}
        homeId={homeId}
        oldAdvanceImage={oldAdvanceImage}
        setOldAdvanceImage={setOldAdvanceImage}
      />
      <TopListing
        toplist={toplist}
        setToplist={setToplist}
        toplistImage={toplistImage}
        setToplistImage={setToplistImage}
        homeId={homeId}
        oldToplistImage={oldToplistImage}
        setOldToplistImage={setOldToplistImage}
      />
      <div className="p-4 border mt-10">
        <h1 className="text-black pt-4 font-semibold text-lg">VIDEO PLAYER SECTION</h1>

        {/* Video File Upload */}
        <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36 mt-4">
          <label htmlFor="videoUpload" className="flex flex-col items-center gap-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 fill-white stroke-indigo-500"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-gray-600 font-medium">Upload Video</span>
            <span className="text-xs text-gray-600">No size limit</span>
          </label>
          <input
            id="videoUpload"
            type="file"
            name="videoPlayer"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setVideos(prev => [...(Array.isArray(prev) ? prev : []), ...files]);
            }}
          />
        </div>

        {/* New uploaded videos preview */}
        {Array.isArray(videos) && videos.length > 0 && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-green-600 mb-2">NEW VIDEOS (Upload hone wale)</h2>
            <div className="flex gap-4 flex-wrap">
              {videos.map((file, i) => (
                <div key={i} className="relative">
                  <video controls className="w-48 h-32 object-cover"
                    src={file instanceof File ? URL.createObjectURL(file) : file} />
                  <button type="button"
                    onClick={() => setVideos(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YouTube URL Add Section */}
        <div className="mt-6 border border-yellow-400 p-4">
          <h2 className="text-black font-semibold mb-2">ADD YOUTUBE VIDEO URL</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=XXXXXX"
              className="border border-black px-3 py-2 outline-0 flex-1"
              value={youtubeVideoUrl}
              onChange={(e) => setYoutubeVideoUrl(e.target.value)}
            />
            <button
              type="button"
              className="bg-yellow-500 text-white px-4 py-2"
              onClick={() => {
                const trimmed = youtubeVideoUrl.trim();
                if (!trimmed) return;
                let videoId = "";
                const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
                const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
                const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
                const idOnly = trimmed.match(/^([a-zA-Z0-9_-]{11})$/);
                if (embedMatch) videoId = embedMatch[1];
                else if (watchMatch) videoId = watchMatch[1];
                else if (shortMatch) videoId = shortMatch[1];
                else if (idOnly) videoId = idOnly[1];
                if (!videoId) { alert("Valid YouTube URL nahi hai."); return; }
                const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                setNewYoutubeVideoUrls(prev => [...prev, embedUrl]);
                setYoutubeVideoUrl("");
              }}
            >+ Add</button>
          </div>

          {/* New YouTube previews */}
          {newYoutubeVideoUrls.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-green-600 mb-2">NEW YOUTUBE VIDEOS</h3>
              <div className="flex gap-4 flex-wrap">
                {newYoutubeVideoUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <iframe src={url} className="w-48 h-28"
                      allow="autoplay; encrypted-media" allowFullScreen />
                    <button type="button"
                      onClick={() => setNewYoutubeVideoUrls(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Old YouTube URL Preview */}
        {oldYoutubeUrl && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">SAVED YOUTUBE VIDEO</h2>
            <div className="relative">
              <iframe
                src={oldYoutubeUrl}
                className="w-48 h-28"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await axios.delete(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/deleteimage/${homeId}`,
                      {
                        data: {
                          section: "videos",
                          field: "youtubeUrl",
                          imageUrl: oldYoutubeUrl,
                        },
                      }
                    );
                    setOldYoutubeUrl("");
                    setNewYoutubeVideoUrls([]);
                    toast.success("YouTube video deleted!");
                  } catch {
                    toast.error("Delete failed!");
                  }
                }}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 z-10"
              >✕</button>
            </div>
          </div>
        )}
        {/* Old saved videos/YouTube */}
        {Array.isArray(oldVideo) && oldVideo.length > 0 && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">OLD VIDEOS</h2>
            <div className="flex gap-4 flex-wrap">
              {[...oldVideo].reverse().map((url, i) => (
                <div key={i} className="relative">
                  {url.includes("youtube.com/embed") ? (
                    <iframe src={url} className="w-48 h-28"
                      allow="autoplay; encrypted-media" allowFullScreen />
                  ) : (
                    <video controls className="w-48 h-28 object-cover" src={url} />
                  )}
                  <button type="button"
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/deleteimage/${homeId}`,
                          { data: { section: "videos", field: "videoUrls", imageUrl: url } }
                        );
                        setOldVideo(prev => prev.filter(u => u !== url));
                        toast.success("Video deleted!");
                      } catch { toast.error("Delete failed!"); }
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Title & Description */}
        <div className="mb-4 mt-6">
          <h1 className="text-black">TITLE</h1>
          <input type="text" placeholder="Video Title"
            className="border border-black px-3 py-2 mt-2 outline-0 w-full"
            value={videoData} onChange={(e) => setVideoData(e.target.value)} />
        </div>
        <div className="mb-4 mt-4">
          <h1 className="text-black">DESCRIPTION</h1>
          <textarea placeholder="Description"
            className="border border-black px-3 py-2 mt-2 outline-0 w-full"
            value={videoData2} onChange={(e) => setVideoData2(e.target.value)} />
        </div>
      </div>

      <Robot
        robot={robot}
        setRobot={setRobot}
        robotImage={robotImage}
        setRobotImage={setRobotImage}
        homeId={homeId}
        oldRobotImage={oldRobotImage}
        setOldRobotImage={setOldRobotImage}
      />
      <Competition
        competate={competate}
        setCompetate={setCompetate}
        competateImage={competateImage}
        setCompetateImage={setCompetateImage}
        homeId={homeId}
        oldCompetateImage={oldCompetateImage}
        setOldCompetateImage={setOldCompetateImage}
      />
      <Runway
        runway={runway}
        setRunway={setRunway}
        runwayImage={runwayImage}
        setRunwayImage={setRunwayImage}
        homeId={homeId}
        oldRunwayImage={oldRunwayImage}
        setOldRunwayImage={setOldRunwayImage}
      />
      <div className="flex justify-end mt-8 mb-8">
        {homeId ? (
          <button
            onClick={handleUpdate}
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white px-12 py-2 rounded-sm"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        ) : (
          <button
            onClick={handleCreate}
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white px-12 py-2 rounded-sm"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Hero;
