"use client";

import "quill/dist/quill.snow.css";
import { useParams } from "next/navigation";
import Image from "next/image";
import Hero from "@/components/Home/Hero";
import { CiCalendar } from "react-icons/ci";
import youtube from "../../../assets/images/you3.png";
import twitter from "../../../assets/images/x.jpg";
import tiktok from "../../../assets/images/tik.png";
import insta from "../../../assets/images/newInsta.webp";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import Loading from "@/components/faq/Loading";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import slugify from "slugify";

const extractYouTubeId = (url) => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : "";
};

const splitContentInHalf = (html) => {
  if (!html) return { first: "", second: "" };

  const mid = Math.floor(html.length / 2);
  const closingTagIndex = html.indexOf(">", mid);

  if (closingTagIndex === -1) {
    return { first: html, second: "" };
  }

  const splitAt = closingTagIndex + 1;
  return {
    first: html.slice(0, splitAt),
    second: html.slice(splitAt),
  };
};

const BlogDetail = () => {
  const { title } = useParams();
  console.log(title, "title");

  const [title2, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [alt, setAlt] = useState("");
  const [article, setArticle] = useState([]);
  const [singleBlog, setSingleBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState({
    page: "news",
    title: "",
    description: "",
  });

  const icons = [
    { src: insta, link: "https://www.instagram.com" },
    { src: tiktok, link: "https://www.tiktok.com" },
    { src: youtube, link: "https://www.youtube.com" },
    { src: twitter, link: "https://www.twitter.com" },
  ];

  const currentIndex = article.findIndex(
    (b) =>
      slugify(b?.title || "", { lower: true, strict: true, locale: "en" }) ===
      decodeURIComponent(title),
  );
  const prevBlog = currentIndex > 0 ? article[currentIndex - 1] : null;
  const nextBlog =
    currentIndex < article.length - 1 ? article[currentIndex + 1] : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/news/getnews`,
        );
        const homeData = data.news[0];
        if (homeData) {
          setTitle(homeData.title || "");
          setImage(homeData.bgImage || "");
          setAlt(homeData.alt || "News background image");
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/getblog`,
        );
        if (data.blogs?.length) {
          setArticle(data.blogs);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!title || !article.length) return;

    const blog = article.find(
      (b) => slugify(b?.title || "", { lower: true, strict: true }) === title,
    );
    setSingleBlog(blog || null);
  }, [title, article]);

  useEffect(() => {
    console.log(singleBlog, "Updated singleBlog");
  }, [singleBlog]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/getmetadata`,
        );
        if (data?.data?.length) {
          const meta = data.data[0];
          setMetaData({
            page: "news",
            title: meta.news?.title || "",
            description: meta.news?.description || "",
          });
        }
      } catch (error) {}
    };

    fetchMetaData();
  }, []);

  if (loading) return <Loading />;

  if (!singleBlog) {
    return (
      <div className="text-center mt-10 text-gray-700">No blog found.</div>
    );
  }

  return (
    <div>
      <Head>
        <title>{metaData.title || "Blog Details"}</title>
        <meta name="description" content={metaData.description} />
      </Head>

      <Hero
        image={[{ type: "video", value: image }]}
        title1={title2 || "Frames Gen-3"}
        alt={alt}
      />

      <div className=" relative grid lg:grid-cols-[65%_33%] max-md:grid-cols-1 md:gap-8 px-4 sm:px-6 lg:px-20 mt-8">
        <div>
          <h1 className="text-3xl pb-6 font-sans">{singleBlog.title}</h1>

          {singleBlog.image && (
            <div className="mb-6">
              <Image
                width={500}
                height={370}
                src={singleBlog.image}
                alt={singleBlog.title || "Blog image"}
                className="w-full max-h-[370px] object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <p className="text-black">AUTHOR:</p>
                <p className="text-gray-600">{singleBlog.author}</p>
              </div>
              <div className="flex items-center gap-2">
                <CiCalendar size={18} />
                <p className="text-sm text-[#475156] font-sans">
                  {singleBlog.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {icons.map((icon, ind) => (
                <a
                  key={ind}
                  href={icon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={icon.src}
                    alt="Social icon"
                    width={ind === 0 ? 48 : 32}
                    height={ind === 0 ? 48 : 32}
                    className="object-contain"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="pb-12 pt-6">
            {singleBlog.youtubeUrl && singleBlog.youtubeUrl.trim() !== "" ? (
              (() => {
                const { first, second } = splitContentInHalf(
                  singleBlog.content || "",
                );
                return (
                  <>
                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{ __html: first }}
                    />

                    {/* YouTube Video - Middle */}
                    <div className="my-8">
                      <div
                        className="relative w-full"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <iframe
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          src={`https://www.youtube.com/embed/${extractYouTubeId(singleBlog.youtubeUrl)}`}
                          title="YouTube video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>

                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{ __html: second }}
                    />
                  </>
                );
              })()
            ) : (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: singleBlog.content }}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="mb-12">
          <div className=" sticky top-[100px] border border-[#E4E7E9] px-6 max-sm:px-3 max-sm:mt-6 rounded">
            <h1 className="pt-6 pb-6 text-xl font-sans text-[#191C1F]">
              Latest Articles
            </h1>
            {[...article]
              .filter((blog) => blog.title !== singleBlog.title) // exclude the current blog
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 3)
              .map((blog, ind) => (
                <Link
                  href={`/news/${slugify(blog.title || "", {
                    lower: true,
                    strict: true,
                  })}`}
                  key={ind}
                >
                  <div className="hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-4 font-sans mb-6">
                    <Image
                      width={100}
                      height={140}
                      src={blog.image}
                      alt={blog.title || "Latest blog image"}
                      className="max-w-40 max-h-24 rounded-sm object-cover"
                    />
                    <div>
                      <h2 className="text-sm text-[#191C1F] font-medium">
                        {blog.title}
                      </h2>
                      <p className="text-[#77878F] font-normal text-sm pt-1.5">
                        {blog.date}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-8 mt-0 md:mt-12 pb-16">
        {prevBlog && (
          <Link
            href={`/news/${slugify(prevBlog.title, {
              lower: true,
              strict: true,
            })}`}
            aria-label="Previous Article"
            className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-[#f0f0f0] hover:to-[#ddd] text-gray-800 px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <FaArrowLeft className="text-[#444] group-hover:text-black transition" />
            <span className="font-semibold">Previous</span>
          </Link>
        )}

        {nextBlog && (
          <Link
            href={`/news/${slugify(nextBlog.title, {
              lower: true,
              strict: true,
            })}`}
            aria-label="Next Article"
            className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-[#f0f0f0] hover:to-[#ddd] text-gray-800 px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <span className="font-semibold">Next</span>
            <FaArrowRight className="text-[#444] group-hover:text-black transition" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
