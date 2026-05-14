"use client";
import React from "react";
import Image from "next/image";
import runway1 from "../../assets/images/runway.png";
import Link from "next/link";
import { motion } from "framer-motion";

const Runway = ({ margin, title, image, button, alt, link }) => {
  return (
    <div
      className={` overflow-hidden ${
        margin ? "md:mt-32 mt-16 " : "mt-0"
      } relative w-full h-[400px] max-sm:h-[300px]  flex items-center justify-center text-center text-white`}
    >
      <div className="absolute inset-0 w-full h-full">
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

        <a href={link} target="_blank">
          <motion.div
            initial={{ x: 150, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.4 }}
            className=""
          >
            <button
              className="mt-12 max-sm:mt-6 px-10  rounded hover:border-[#00a4c2]  py-2 duration-300 transition-all text-white
         border-2 border-white hover:bg-[#00a4c2]  hover:scale-105"
            >
              {button}
            </button>
          </motion.div>
        </a>
      </div>
    </div>
  );
};

export default Runway;
