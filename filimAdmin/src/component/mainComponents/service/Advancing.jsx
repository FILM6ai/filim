"use client";

import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Advancing = ({
  advance,
  setAdvance,
  advanceImage,
  setAdvanceImage,
  serviceId,
  oldAdvanceImage,
  setOldAdvanceImage,
  sectionName,
}) => {
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setAdvance((data) => ({ ...data, [name]: value }));
  };

  return (
    <div>
      <div className=" mt-12 p-4 border">
        {" "}
        <h1 className="mt-4 mb-12 text-center text-3xl font-semibold">
          SECTION 1
        </h1>{" "}
        <form>
          {" "}
          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            {" "}
            <label
              htmlFor="upload3"
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
              <span className="text-xs text-gray-600">Max Size:5MB</span>
            </label>
            <input
              // onChange={(e) => setAdvanceImage(e.target.files[0])}
              onChange={(e) => {
                const file = e.target.files[0];
                const result = validateFile(file);
                if (!result.valid) {
                  alert(result.message);
                  return;
                }
                setAdvanceImage(file);
              }}
              id="upload3"
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
          {advanceImage && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-green-600 mb-1">
                uploaded image
              </h2>
              <img
                src={
                  advanceImage instanceof File
                    ? URL.createObjectURL(advanceImage)
                    : advanceImage
                }
                alt="Preview"
                className="w-36 h-auto"
              />
            </div>
          )}
          {oldAdvanceImage && oldAdvanceImage.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-500 mb-1">
                OLD IMAGES
              </h2>
              <div className="flex gap-2 flex-wrap">
                {[...oldAdvanceImage].reverse().map((url, index) => (
                  <div key={index} className="relative w-36">
                    <img src={url} alt="Old" className="w-36 h-auto" />
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/service/deleteimage/${serviceId}`,
                            {
                              data: {
                                section: sectionName,
                                field: "bgImage",
                                imageUrl: url,
                              },
                            },
                          );
                          setOldAdvanceImage((prev) =>
                            prev.filter((u) => u !== url),
                          );
                          toast.success("Image deleted!");
                        } catch {
                          toast.error("Delete failed!");
                        }
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Text Input Fields */}
          <div className="mt-8">
            <div className="mb-4">
              <h1 className="text-black">ALT TEXT</h1>
              <input
                type="text"
                placeholder="Alt Text"
                className="border border-black px-3 py-2 mt-2 outline-0"
                value={advance.alt}
                onChange={onChangeHandler}
                name="alt"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">TITLE</h1>
              <input
                type="text"
                placeholder="Title"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={advance.title}
                onChange={onChangeHandler}
                name="title"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">TITLE TWO</h1>
              <input
                type="text"
                placeholder="Title"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={advance.title2}
                onChange={onChangeHandler}
                name="title2"
              />
            </div>
            <div className="mb-4 mt-4">
              <h1 className="text-black">DESCRIPTION</h1>
              <textarea
                placeholder="Description"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={advance.description}
                onChange={onChangeHandler}
                name="description"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Advancing;
