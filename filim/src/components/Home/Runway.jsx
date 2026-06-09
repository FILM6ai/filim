"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import runway1 from "../../assets/images/runway.png";
import { motion } from "framer-motion";

const Runway = ({ margin, title, image, button, alt, link, youtubeUrl, popup }) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  const convertToEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) return url;
    if (url.includes("youtu.be/")) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : "";
    }
    if (url.includes("youtube.com/watch")) {
      const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : "";
    }
    return "";
  };

  const sectionEmbedUrl = convertToEmbedUrl(youtubeUrl);
  const popupEmbedUrl = convertToEmbedUrl(popup?.youtubeUrl);
  const hasPopup =
    (popup?.content && popup.content.trim().length > 0) ||
    (popup?.description && popup.description.trim().length > 0) ||
    (popup?.heading && popup.heading.trim().length > 0) ||
    (popup?.title && popup.title.trim().length > 0) ||
    (popup?.image && popup.image.trim().length > 0) ||
    (popupEmbedUrl && popupEmbedUrl.trim().length > 0);
  return (
    <div
      className={` overflow-hidden ${margin ? "md:mt-32 mt-16 " : "mt-0"
        } relative w-full h-[400px] max-sm:h-[300px]  flex items-center justify-center text-center text-white`}
    >
      <div className="absolute inset-0 w-full h-full">
        {sectionEmbedUrl ? (
          <iframe
            src={sectionEmbedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Image
            src={
              (Array.isArray(image) && image.length > 0
                ? image[image.length - 1]
                : image) || runway1
            }
            alt={alt || "Runway"}
            layout="fill"
            objectFit="cover"
            className="brightness-50 w-full"
          />
        )}
      </div>

      {/* Text Content */}
      <div className="relative z-10 px-4 md:px-8 pt-12">
        <motion.div
          initial={{ x: -150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
          className=""
        >
          <h1 className="text-2xl md:text-5xl max-w-[700px] ">{title}</h1>
        </motion.div>

        {hasPopup ? (
          <motion.div
            initial={{ x: 150, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.4 }}
            className=""
          >
            <button
              onClick={() => setShowPopup(true)}
              className="mt-12 max-sm:mt-6 px-10  rounded hover:border-[#00a4c2]  py-2 duration-300 transition-all text-white
         border-2 border-white hover:bg-[#00a4c2]  hover:scale-105"
            >
              {button}
            </button>
          </motion.div>
        ) : (
          <a href={link} target="_blank" rel="noreferrer">
            <motion.div
              initial={{ x: 150, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.4 }}
              className=""
            >
              <button
                className="mt-12 max-sm:mt-6 px-10 rounded hover:border-[#00a4c2] py-2 duration-300 transition-all text-white border-2 border-white hover:bg-[#00a4c2] hover:scale-105"
              >
                {button}
              </button>
            </motion.div>
          </a>
        )}
      </div>
      {hasPopup && showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6">
          <div
            className="relative w-full max-w-[min(680px,calc(100vw-32px))] rounded-[10px] bg-[#111111] p-6 text-white shadow-2xl border border-white/10 sm:p-8"
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4  px-2 py-1 text-sm font-semibold text-white"
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
                {popup?.description || popup?.content || "Get the latest updates and a special discount when you click below."}
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
              {popup?.buttonText && (
                <div className="flex justify-center">
                  <a
                    href={popup?.buttonLink || link || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition hover:bg-white/90 sm:px-10 sm:py-4"
                  >
                    {popup?.buttonText}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Runway;
