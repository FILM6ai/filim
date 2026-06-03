"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import robot from "../../assets/images/robot.png";
import { motion } from "framer-motion";
import Button2 from "./Button2";

const Robot = ({ title, description, button, image, alt, link, youtubeUrl, popup }) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  const convertToEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) {
      const match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    }
    if (url.includes("youtu.be/")) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    }
    if (url.includes("youtube.com/watch")) {
      const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    }
    if (url.includes("<iframe")) {
      const match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : "";
    }
    return "";
  };

  const embedUrl = convertToEmbedUrl(youtubeUrl);
  const popupEmbedUrl = convertToEmbedUrl(popup?.youtubeUrl);
  const hasPopup =
    (popup?.content && popup.content.trim().length > 0) ||
    (popup?.description && popup.description.trim().length > 0) ||
    (popup?.heading && popup.heading.trim().length > 0) ||
    (popup?.title && popup.title.trim().length > 0) ||
    (popup?.image && popup.image.trim().length > 0) ||
    (popupEmbedUrl && popupEmbedUrl.trim().length > 0);

  return (
    <div className="overflow-hidden max-md:mt-14 grid grid-cols-[60%,40%] max-md:flex max-md:flex-col-reverse  bg-black text-white items-center ">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="px-4 sm:px-6 lg:px-20 py-6"
      >
        <h1 className="lg:text-6xl md:text-5xl text-3xl max-w-2xl">{title}</h1>
        <p className="pt-6 max-w-xl pb-4">{description}</p>
        <div className="mt-4">
          {hasPopup ? (
            <button
              onClick={() => setShowPopup(true)}
              className="px-10 rounded hover:border-[#00a4c2] py-2 duration-300 transition-all text-white border-2 border-white hover:bg-[#00a4c2] hover:scale-105"
            >
              {button}
            </button>
          ) : (
            <Button2 button={button} link={link} />
          )}
        </div>
      </motion.div>

      {/* Image Block */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="md:ml-auto w-full h-full"
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full aspect-video h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Image
            src={
              (Array.isArray(image) && image.length > 0
                ? image[image.length - 1]
                : image) || robot
            }
            width={500}
            height={500}
            alt={alt || "robot"}
            className="w-full h-full "
          />
        )}
      </motion.div>
      {hasPopup && showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6">
          <div className="relative w-full max-w-[min(680px,calc(100vw-32px))] rounded-[10px] bg-[#111111] p-6 text-white shadow-2xl border border-white/10 sm:p-8">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 px-2 py-1 text-sm font-semibold text-white"
            >
              ✕
            </button>
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-[#2ec3f5]">
                {popup?.tagline || popup?.subtitle || "Special Offer"}
              </p>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                {popup?.heading || popup?.title || title}
              </h2>
              <p className="mx-auto max-w-[90%] text-base leading-7 text-white/75 sm:text-lg">
                {popup?.description || popup?.content || ""}
              </p>
              {(popup?.image || popupEmbedUrl) && (
                <div className="mx-auto mt-6 max-w-[90%] overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                  {popupEmbedUrl ? (
                    <iframe
                      src={popupEmbedUrl}
                      className="h-[300px] w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Popup video"
                    />
                  ) : (
                    <img
                      src={popup.image}
                      alt={popup.heading || popup.title || "Popup media"}
                      className="h-[300px] w-full object-cover"
                    />
                  )}
                </div>
              )}
              <div className="flex justify-center">
                <a
                  href={popup?.buttonLink || link || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition hover:bg-white/90 sm:px-10 sm:py-4"
                >
                  {popup?.buttonText || button || "Learn More"}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Robot;
