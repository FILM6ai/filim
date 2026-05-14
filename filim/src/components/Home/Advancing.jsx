"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
const Advancing = ({ title1, title2, description, image, color, alt }) => {
  return (
    <div className={` ${color === color ? color : ""}  pt-12 max-sm:pt-10 `}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h1
          className=" px-4 sm:px-6 lg:px-12  capitalize text-heading 
       lg:text-6xl md:text-6xl text-3xl  text-center "
        >
          {title1}
          <br />
          {title2}
        </h1>
        <p className=" px-4 sm:px-6 lg:px-20 text-xl max-w-3xl m-auto pt-6 text-center ">
          {description}
        </p>
      </motion.div>
      <div className={`${image === image ? image : ""}`}>
        {image && (
          <Image
            src={
              Array.isArray(image) && image.length > 0
                ? image[image.length - 1]
                : image
            }
            width={500}
            height={500}
            alt={alt || "advancing"}
            className={` object-cover w-full md:h-[500px] mt-10`}
          />
        )}
      </div>
    </div>
  );
};

export default Advancing;
