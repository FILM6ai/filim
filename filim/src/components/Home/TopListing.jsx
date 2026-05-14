"use client";

import React from "react";
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
}) => {
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
          className={` ${bgColor ? "bg-[#2c2c2c]" : "bg-[#E1E1E1]"} w-[70%] ${
            height ? "h-[80%]" : "h-[95%]"
          } ${
            order === "reverse" ? "right-0" : "left-0"
          } absolute right-0 -z-10 max-sm:-bottom-12 -bottom-10`}
        ></div>
        <div
          className={`${
            order === "reverse"
              ? "md:mr-20 mr-8 mb-16 max-sm:mb-4"
              : "md:ml-20 ml-8 mb-24 max-sm:mb-4"
          }`}
        >
          {youtubeUrl ? (
            <iframe
              src={youtubeUrl}
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
        className={`max-md:mt-24 mb-24 ${
          order === "reverse"
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
            <Button button={button} link={link} />
          </div>
        )}
        <div
          className={`absolute -z-10 max-sm:top-[400px] max-lg:top-[0px] max-sm:right-16 lg:right-6 ${
            order === "reverse" ? "lg:left-0 lg:top-24" : "lg:right-6 lg:top-0"
          } md:w-[25%] w-[50%]`}
        >
          <Image src={icon} alt="image" />
        </div>
      </motion.div>
    </div>
  );
};

export default TopListing;
