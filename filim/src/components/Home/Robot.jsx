"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import robot from "../../assets/images/robot.png";
import { motion } from "framer-motion";
import Button2 from "./Button2";

const Robot = ({ title, description, button, image, alt, link, youtubeUrl }) => {
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
          <Button2 button={button} link={link} />
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
    </div>
  );
};

export default Robot;
