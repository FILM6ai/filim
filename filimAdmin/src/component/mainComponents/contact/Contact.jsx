"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Advancing from "./Advancing";
import { validateFile } from "@/utils/fileValidation";

const Contact = () => {
  const [contactId, setContactId] = useState(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [alt, setAlt] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [advance, setAdvance] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact/getcontact`,
        );
        console.log(data.contact[0], "response get api");

        if (data.contact && data.contact.length > 0) {
          const contactData = data.contact[0];
          setContactId(contactData._id);
          if (contactData?.hero) {
            setTitle(contactData.hero.title || "");
            setImage(contactData.hero.bgImage || "");
            setAlt(contactData.hero.alt || "");
            setDescription(contactData.hero.description || "");
          }
          if (contactData?.advance) {
            setAdvance(contactData.advance);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      const hero = { title, alt, description };
      formData.append("hero", JSON.stringify(hero));
      formData.append("advance", JSON.stringify(advance));

      if (image) {
        formData.append("heroImage", image);
      }

      let response;
      // If contactId exists, update the contact page; otherwise, create a new one.
      if (contactId) {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact/updateContact/${contactId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        toast.success("Contact page updated successfully!");
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact/contatcRoute`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        toast.success("Contact page created successfully!");
      }
      console.log("Response:", response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error submitting data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="p-4 border">
        <h1 className="mt-4 mb-12 text-center text-3xl font-semibold">
          Header{" "}
        </h1>
        <form>
          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            <label
              htmlFor="upload2"
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
              id="upload2"
              type="file"
              accept="video/*"
              className="hidden"
            />
          </div>
          {/* Image Preview */}
          {image && (
            <div className="mt-4">
              <video
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                controls
                className="w-36 h-auto"
              />
            </div>
          )}
          <div className="mt-8">
            <div className="mb-4">
              <h1 className="text-black">ALT TEXT</h1>
              <input
                type="text"
                placeholder="Alt Text"
                className="border border-black px-3 py-2 mt-2 outline-0"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">TITLE</h1>
              <input
                type="text"
                placeholder="Title"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black"> description </h1>
              <input
                type="text"
                placeholder="Title"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
      <Advancing advance={advance} setAdvance={setAdvance} />
      <div className="flex justify-end mt-8 mb-8">
        <button
          onClick={handleSubmit}
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white px-12 py-2 rounded-sm"
        >
          {loading ? "Loading..." : contactId ? "Update" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Contact;
