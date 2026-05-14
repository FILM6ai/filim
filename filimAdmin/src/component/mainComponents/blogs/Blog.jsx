"use client";

import "../../../app/globals.css";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import axios from "axios";
import BlogsGetData from "./BlogsGetData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validateFile } from "@/utils/fileValidation";

// Dynamically import React-Quill to disable SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const Blog = () => {
  const [value, setValue] = useState("");
  const [alt, setAlt] = useState("");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("alt", alt);
      formData.append("date", date);
      formData.append("youtubeUrl", youtubeUrl);
      formData.append("content", value);
      if (image) {
        formData.append("image", image);
        console.log(image, "image");
      }
      console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/blogroute`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      if (response.data.success) {
        toast.success("Blog updated successfully!");
      } else {
        toast.error("Failed to update blog");
      }
      console.log("Blog post created successfully:", response.data);

      setTitle("");
      setAuthor("");
      setValue("");
      setAlt("");
      setDate("");
      setYoutubeUrl("");
      setImage(null);
    } catch (error) {
      toast.error("Failed to update blog");

      console.error("Error creating blog post:", error);
    } finally {
      setLoading(false);
    }
  };

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
  console.log(alt, "slt");

  return (
    <div>
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div>
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
                <span className="text-xs text-gray-600">Max Size:20MB</span>
              </label>
              <input
                // onChange={(e) => setImage(e.target.files[0])}
                onChange={(e) => {
                  const file = e.target.files[0];
                  const result = validateFile(file);
                  if (!result.valid) {
                    alert(result.message);
                    return;
                  }
                  setImage(file);
                }}
                id="upload12"
                type="file"
                className="hidden"
              />
            </div>
            {image && (
              <div className="mt-4">
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt="Preview"
                  className="w-36 h-auto"
                />
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="mt-4">
            <h1 className="text-black">ALT TEXT</h1>
            <input
              type="text"
              placeholder="Alt Text"
              className="border border-black px-3 py-2 mt-2 outline-0"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              name="alt"
            />
          </div>

          <div className="mt-4">
            <h1 className="text-black">TITLE</h1>
            <input
              type="text"
              placeholder="Title"
              className="border border-black px-3 py-2 mt-2 outline-0 w-full"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Author Input */}
          <div className="mt-4">
            <h1 className="text-black">AUTHOR</h1>
            <input
              type="text"
              placeholder="Author"
              className="border border-black px-3 py-2 mt-2 outline-0 w-full"
              name="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <h1 className="text-black">Date</h1>
            <input
              type="text"
              placeholder="Date"
              className="border border-black px-3 py-2 mt-2 outline-0 w-full"
              // name='Date'
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <h1 className="text-black">YOUTUBE VIDEO URL</h1>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              className="border border-black px-3 py-2 mt-2 outline-0 w-full"
              name="youtubeUrl"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </div>
          {/* Rich Text Editor for Blog Content */}
          <div className="pt-8">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              modules={modules}
              className=""
              placeholder="Write something amazing..."
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className=" cursor-pointer hover:bg-indigo-600 transition-all  px-4 py-2 bg-indigo-700 text-white rounded"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <BlogsGetData />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Blog;
