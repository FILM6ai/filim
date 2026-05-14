"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "quill/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const Page = () => {
  const { id } = useParams();

  // Separate state for main blog fields and the main image
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState(""); // URL from the blog document
  const [mainImageFile, setMainImageFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState(""); // New file (if chosen)
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"], // Remove formatting
    ],
  };
  // Fetch all blogs and filter out the one with the matching id.
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/getblog`,
        );
        console.log(data, "api response for blogs");

        if (data.success && data.blogs && data.blogs.length > 0) {
          const foundBlog = data.blogs.find((blog) => blog._id === id);
          if (foundBlog) {
            setAlt(foundBlog.alt);
            setTitle(foundBlog.title);
            setAuthor(foundBlog.author);
            setDate(foundBlog.date);
            setContent(foundBlog.content);
            setMainImageUrl(foundBlog.image || "");
            setYoutubeUrl(foundBlog.youtubeUrl || "");
          } else {
            toast.error("Blog not found");
          }
        } else {
          toast.error("No blogs available");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog data");
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Handle main image file change
  // const handleMainImageChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setMainImageFile(e.target.files[0]);
  //     // Optionally, show preview immediately
  //     setMainImageUrl(URL.createObjectURL(e.target.files[0]));
  //   }
  // };

  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const result = validateFile(file);
      if (!result.valid) {
        alert(result.message);
        return;
      }
      setMainImageFile(file);
      setMainImageUrl(URL.createObjectURL(file));
    }
  };

  // Handle form submission to update blog data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("date", date);
      formData.append("content", content);
      formData.append("alt", alt);
      formData.append("youtubeUrl", youtubeUrl);
      // Append new main image file if one is selected; otherwise, the backend should keep the old one.
      if (mainImageFile) {
        formData.append("image", mainImageFile);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/blogrouteupdate/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data.success) {
        toast.success("Blog updated successfully!");
      } else {
        toast.error("Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("An error occurred while updating the blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 pt-8">Update Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {mainImageUrl && (
            <div className="mb-2">
              <img src={mainImageUrl} alt="Main Blog" className="w-36" />
            </div>
          )}

          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            <label
              htmlFor="upload12"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 fill-white stroke-indigo-500"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-gray-600 font-medium">Upload file</span>
            </label>
            <input
              onChange={handleMainImageChange}
              id="upload12"
              type="file"
              className="hidden"
            />
          </div>
        </div>
        {/* Title Input */}
        <div className="mb-4">
          <label htmlFor="alt" className="block font-medium mb-2">
            Text Alt
          </label>
          <input
            type="text"
            name="alt"
            id="alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        {/* Author Input */}
        <div className="mb-4">
          <label htmlFor="author" className="block font-medium mb-2">
            Author
          </label>
          <input
            type="text"
            name="author"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        {/* Main Image Preview & Upload */}
        <div className="mt-4">
          <h1 className="text-black">Date</h1>
          <input
            type="text"
            placeholder="Date"
            className="border border-black px-3 py-2 mt-2 outline-0 w-full"
            name="Date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
  <label htmlFor="youtubeUrl" className="block font-medium mb-2">
    YouTube Video URL
  </label>
  <input
    type="text"
    id="youtubeUrl"
    name="youtubeUrl"
    placeholder="https://www.youtube.com/watch?v=..."
    className="w-full border p-2 rounded"
    value={youtubeUrl}
    onChange={(e) => setYoutubeUrl(e.target.value)}
  />
</div>

        {/* Rich Text Editor for Content */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Content</label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Write something amazing..."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 cursor-pointer text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Page;
