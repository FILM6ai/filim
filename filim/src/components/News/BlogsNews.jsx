"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../faq/Loading";
import slugify from "slugify";
import { API_BASE_URL } from "@/utils/backend";
// `videoSlot` is the page's video block, dropped in after `videoAfter` articles
// instead of sitting under the header - on this page the header is followed
// immediately by the article grid, so a video there interrupts the list before it
// has started. Null when the page has no video set, in which case the grid stays
// a single uninterrupted run exactly as before.
const BlogsNews = ({ videoSlot = null, videoAfter = 6 }) => {
  const [bloges, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/blog/getblog`,
        );
        console.log(data.blogs, "api response for blogs");

        if (data.blogs && data.blogs.length > 0) {
          setBlogs(data.blogs);
        } else {
          console.error("Failed to fetch blogs:", data.message);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!bloges.length) {
    return <div>No blogs found.</div>;
  }
  const sorted = [...bloges].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Without a video this is one list and one grid, unchanged. With one, the list
  // is cut in two so the video sits between the rows rather than on top of them.
  const groups = videoSlot
    ? [sorted.slice(0, videoAfter), sorted.slice(videoAfter)].filter(
        (group) => group.length > 0,
      )
    : [sorted];

  const renderGrid = (articles, key, withBottomPadding) => (
    <div
      key={key}
      className={`${withBottomPadding ? "md:pb-24" : ""}  max-w-7xl m-auto   px-4 sm:px-6 lg:px-20 pt-16`}
    >
      <div className=" relative  z-10 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-8">
        {articles.map((article, ind) => (
              <motion.div
                key={article.title || ind}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.1 }}
              >
                <Link
                  href={`/news/${slugify(article.title, {
                    lower: true,
                    strict: true,
                  })}`}
                  className="group cursor-pointer"
                >
                  <div className="relative z-50 mb-6">
                    <Image
                      width={500}
                      height={500}
                      src={article.image}
                      alt={article.title}
                      className="w-full max-h-[160px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute -bottom-4 z-50 right-6 bg-[#2D4A68] backdrop-blur-sm px-3 py-1 flex items-center gap-1">
                      <span className="text-sm text-white">{article.date}</span>
                    </div>
                  </div>
                  <div className="  shadow-xl px-5">
                    <div className="flex items-center mb-3 gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#2B3674]">
                          by {article.author}
                        </span>
                      </div>
                    </div>
                    <h3 className="lg:text-2xl font-sans md:text-xl text-2xl font-semibold text-black mb-3">
                      {article.title}
                    </h3>
                    <button className="mb-8 mt-2 text-[#737373] hover:text-buttonColor transition-colors">
                      Read More
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </div>
  );

  return (
    <div className=" ">
      {groups.map((group, index) => (
        <div key={index}>
          {renderGrid(group, index, index === groups.length - 1)}
          {videoSlot && index === 0 && groups.length > 1 ? videoSlot : null}
        </div>
      ))}
      {/* Fewer articles than the cut-off: there is no second half to sit above,
          so the video goes at the end rather than vanishing. */}
      {videoSlot && groups.length === 1 ? videoSlot : null}
    </div>
  );
};

export default BlogsNews;
