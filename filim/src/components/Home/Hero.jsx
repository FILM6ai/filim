"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoSend } from "react-icons/io5";
const Hero = ({
  title1,
  description,
  button,
  image,
  height,
  alt,
  link,
  arrowLeft,
  arrowRight,
  buttonText,
  buttonLink,
}) => {
  const swiperRef = useRef(null);
  const videoRefs = useRef([]);
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!swiperRef.current) return;

    swiperRef.current.on("slideChange", () => {
      videoRefs.current.forEach((video) => {
        if (video && video.pause) {
          video.pause();
          video.currentTime = 0;
        }
      });

      const activeIndex = swiperRef.current.activeIndex;
      const video = videoRefs.current[activeIndex];
      if (video && video.play) video.play();
    });

    // Pehli slide ka video play karo
    const firstVideo = videoRefs.current[0];
    if (firstVideo && firstVideo.play) firstVideo.play();
  }, [image]);

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/postregistration`,
        { email },
      );
      if (response.data.success) {
        toast.success("Registration Completed! 🎉");
        setEmail("");
        setShowInput(false);
      } else {
        toast.error("Registration failed. Try again.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-black text-white">
        {/* Hero Section */}
        <div
          className={`relative  ${height ? "h-[120vh] max-sm:h-[70vh]" : "h-[100vh] max-sm:h-[60vh]"
            }`}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: ".swiper-custom-next",
              prevEl: ".swiper-custom-prev",
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            allowTouchMove={true}
            className="w-full h-full relative"
          >
            {image.map((img, idx) => (
              <SwiperSlide key={idx}>
                {img.type === "youtube" ? (
                  <iframe
                    src={img.value}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media; autoplay"
                    allowFullScreen
                    style={{ border: "none", pointerEvents: "auto", zIndex: 0 }}
                  />
                ) : img.type === "video" ? (
                  <video
                    ref={(el) => (videoRefs.current[idx] = el)}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={img.value}
                    muted
                    playsInline
                    autoPlay
                    loop={true}
                    onEnded={() => {
                      const swiper = swiperRef.current;
                      if (!swiper) return;
                      if (idx === image.length - 1) {
                        swiper.slideTo(0);
                      } else {
                        swiper.slideNext();
                      }
                    }}
                  />
                ) : (
                  <Image
                    src={img.value}
                    alt={alt || "Hero Background"}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </SwiperSlide>
            ))}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/0 z-10 pointer-events-none" />

            {/* Custom Arrows */}
            {arrowLeft && (
              <div className="swiper-custom-prev absolute max-sm:left-0 left-3 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
                <FaArrowLeft className="text-2xl" />
              </div>
            )}
            {arrowRight && (
              <div className="swiper-custom-next absolute max-sm:right-0 right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
                <FaArrowRight className="text-2xl" />
              </div>
            )}
          </Swiper>

          {/* Content */}
          <div className="absolute top-0 z-20 mx-3 sm:mx-6 lg:mx-20 h-full flex items-center pointer-events-none">
            <motion.div
              className="pt-28"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="pointer-events-auto">
                <h1 className=" max-sm:text-center max-sm:max-w-[342px] max-w-[820px] lg:leading-[80px] md:leading-[70px] max-sm:leading-[38px] text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-10">
                  {title1}
                </h1>
                <p className="text-lg max-sm:text-center sm:text-2xl text-gray-300 mb-8">
                  {description}
                </p>
                {button &&
                  (!showInput ? (
                    <button
                      onClick={handleButtonClick}
                      className="w-44 py-2 duration-300 transition-all rounded-md text-white bg-black border border-white hover:bg-[#00a4c2]  hover:scale-105 hover:text-white duration-300 transition-all"
                    >
                      {button}
                    </button>
                  ) : (
                    <div className="flex items-center bg-black border border-white rounded-md w-64 max-w-[256px] overflow-hidden flex-shrink-0">
                      <MdEmail className="text-white text-[20px] ml-3 mb-0.5" />
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        style={{ colorScheme: "dark" }}
                        className="bg-transparent text-white placeholder-gray-400 px-3 py-3 outline-none w-0 flex-1 min-w-0 text-[14px]"
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="pr-3 text-white hover:text-gray-300 transition-colors"
                      >
                        {loading ? (
                          <span className="text-[14px]">...</span>
                        ) : (
                          <IoSend className="text-[14px]" />
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
          {buttonText && buttonLink && (
            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
              <a
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-40 sm:w-52 md:w-60 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base flex items-center justify-center rounded-md text-white bg-black border border-white hover:bg-[#00a4c2] hover:scale-105 hover:text-white duration-300 transition-all tracking-widest uppercase font-medium"
               >
                {buttonText}
              </a>
            </div>
          )}
          <>
            <style>{`
  .swiper-pagination {
    bottom: 16px !important;
  }
  .swiper-pagination-bullet {
    width: 14px;
    height: 14px;
    background: black;
    opacity: 1;
    margin: 0 6px;
  }
  .swiper-pagination-bullet-active {
    background: red !important;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px black inset !important;
    -webkit-text-fill-color: white !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`}</style>
          </>
        </div>
      </div>
    </div>
  );
};
<ToastContainer position="top-right" autoClose={3000} />;
export default Hero;
