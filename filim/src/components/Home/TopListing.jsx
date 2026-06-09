"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "./Button";
import icon from "../../assets/images/sideicon.png";
import { motion } from "framer-motion";

const TopListing = ({
  title,
  description,
  image,
  order,
  description2,
  line,
  genere,
  height,
  bgColor,
  button,
  alt,
  link,
  youtubeUrl,
  popup,
}) => {
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
    <div className=" overflow-hidden  mt-20 relative grid md:grid-cols-2 grid-cols-1 justify-center items-center gap-4">
      {/* Image Block */}
      <motion.div
        initial={{ x: order === "reverse" ? 100 : -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.1 }}
        className={`relative  ${order === "reverse" ? "md:order-2" : ""}`}
      >
        <div
          className={` ${bgColor ? "bg-[#2c2c2c]" : "bg-[#E1E1E1]"} w-[70%] ${height ? "h-[80%]" : "h-[95%]"
            } ${order === "reverse" ? "right-0" : "left-0"
            } absolute right-0 -z-10 max-sm:-bottom-12 -bottom-10`}
        ></div>
        <div
          className={`${order === "reverse"
              ? "md:mr-20 mr-8 mb-16 max-sm:mb-4"
              : "md:ml-20 ml-8 mb-24 max-sm:mb-4"
            }`}
        >
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <Image
              src={
                (Array.isArray(image) && image.length > 0
                  ? image[image.length - 1]
                  : image) || icon
              }
              width={500}
              height={500}
              alt={alt || "icon"}
              className="w-full h-full"
            />
          )}
        </div>
      </motion.div>

      {/* Text Block */}
      <motion.div
        initial={{ x: order === "reverse" ? -100 : 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className={`max-md:mt-24 mb-24 ${order === "reverse"
            ? "md:order-1 px-4 sm:px-6 md:px-20 "
            : "px-4 sm:px-6 md:pr-24 "
          }`}
      >
        <h1 className="capitalize text-5xl text-heading ">{title}</h1>
        {genere && (
          <h2 className="pb-8 pt-9 text-[paragraph] font-bold">{genere}</h2>
        )}
        {line && (
          <p className="font-sans text-paragaraph font-medium">{line}</p>
        )}
        <p className="text-paragaraph font-sans text-xl max-w-2xl pt-5">
          {description}
        </p>
        {description2 && (
          <p className="text-paragaraph text-xl font-sans max-w-2xl pt-1">
            {description2}
          </p>
        )}

        {button && (
          <div className="pt-6">
            {hasPopup ? (
              <button
                onClick={() => setShowPopup(true)}
                className="px-10 rounded hover:border-[#00a4c2] py-2 duration-300 transition-all text-white bg-[#00a4c2] border-2 border-[#00a4c2] hover:scale-105"
              >
                {button}
              </button>
            ) : (
              <Button button={button} link={link} />
            )}
          </div>
        )}
        <div
          className={`absolute -z-10 max-sm:top-[400px] max-lg:top-[0px] max-sm:right-16 lg:right-6 ${order === "reverse" ? "lg:left-0 lg:top-24" : "lg:right-6 lg:top-0"
            } md:w-[25%] w-[50%]`}
        >
          <Image src={icon} alt="image" />
        </div>
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

export default TopListing;
