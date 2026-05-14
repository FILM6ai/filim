import { validateFile } from "@/utils/fileValidation";
import React from "react";

const NewCards = ({
  card1,
  setCard1,
  setCard2,
  card2,
  card3,
  setCard3,
  card4,
  setCard4,
  card5,
  setCard5,
  card6,
  setCard6,
  card1Image,
  setCard1Image,
  card2Image,
  setCard2Image,
  card3Image,
  setCard3Image,
  card4Image,
  setCard4Image,
  card5Image,
  setCard5Image,
  card6Image,
  setCard6Image,
}) => {
  const convertToEmbedUrl = (url) => {
    if (!url) return "";
    // Agar pehle se embed URL hai
    if (url.includes("youtube.com/embed/")) {
      const match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    }
    // youtu.be short link
    if (url.includes("youtu.be/")) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    }
    // watch?v= link
    if (url.includes("youtube.com/watch")) {
      const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    }
    // pura iframe tag paste kiya ho
    if (url.includes("<iframe")) {
      const match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : "";
    }
    return "";
  };
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCard1((data) => ({ ...data, [name]: value }));
  };
  const onChangeHandler2 = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCard2((data) => ({ ...(data || { description: "" }), [name]: value }));
  };
  const onChangeHandler3 = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCard3((data) => ({ ...data, [name]: value }));
  };
  const onChangeHandler4 = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCard4((data) => ({ ...data, [name]: value }));
  };
  const onChangeHandler5 = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCard5((data) => ({ ...data, [name]: value }));
  };
  const onChangeHandler6 = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCard6((data) => ({ ...data, [name]: value }));
  };
  console.log(card1Image);
  console.log(card1);

  return (
    <div>
      <div className="p-4 border mt-12">
        <h1 className="mt-4 mb-12 text-center text-3xl font-semibold">cards</h1>
        <form>
          {/* File Upload Section */}
          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            <label
              htmlFor="upload30"
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
              // onChange={(e) => setCard1Image(e.target.files[0])}
              onChange={(e) => {
                const file = e.target.files[0];
                const result = validateFile(file);
                if (!result.valid) {
                  alert(result.message);
                  return;
                }
                setCard1Image(file);
              }}
              id="upload30"
              name="card1Image"
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
          {/* Image Preview */}
          {card1Image && (
            <div className="mt-4">
              <img
                src={
                  typeof card1Image === "string"
                    ? card1Image
                    : URL.createObjectURL(card1Image)
                }
                alt="Preview"
                className="w-36 h-auto"
              />
            </div>
          )}

          {/* Text Input Fields */}
          <div className="mt-8">
            <div className="mb-4">
              <h1 className="text-black">Main Title</h1>
              <input
                type="text"
                placeholder="Alt Text"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card1.mainTitle}
                onChange={onChangeHandler}
                name="mainTitle"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black"> Descripion </h1>
              <input
                type="text"
                placeholder="Alt Text"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card1.description}
                onChange={onChangeHandler}
                name="description"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">YOUTUBE URL (optional)</h1>
              <input
                type="text"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card1.youtubeUrl || ""}
                onChange={(e) => {
                  const converted = convertToEmbedUrl(e.target.value);
                  setCard1((data) => ({ ...data, youtubeUrl: converted }));
                }}
                name="youtubeUrl"
              />
              <p className="text-xs text-gray-500 mt-1">
                If a YouTube URL is provided, the image will be hidden.              </p>
            </div>
          </div>
        </form>

        <form>
          {/* File Upload Section */}
          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            <label
              htmlFor="upload32"
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
              // onChange={(e) => setCard2Image(e.target.files[0])}
              onChange={(e) => {
                const file = e.target.files[0];
                const result = validateFile(file);
                if (!result.valid) {
                  alert(result.message);
                  return;
                }
                setCard2Image(file);
              }}
              id="upload32"
              name="card2Image"
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
          {/* Image Preview */}
          {card2Image && (
            <div className="mt-4">
              <img
                src={
                  typeof card2Image === "string"
                    ? card2Image
                    : URL.createObjectURL(card2Image)
                }
                alt="Preview"
                className="w-36 h-auto"
              />
            </div>
          )}

          {/* Text Input Fields */}
          <div className="mt-8">
            <div className="mb-4">
              <h1 className="text-black"> Descripion </h1>
              <input
                type="text"
                placeholder="Alt Text"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card2?.description || ""}
                onChange={onChangeHandler2}
                name="description"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">YOUTUBE URL (optional)</h1>
              <input
                type="text"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card2?.youtubeUrl || ""}
                onChange={(e) => {
                  const converted = convertToEmbedUrl(e.target.value);
                  setCard2((data) => ({ ...data, youtubeUrl: converted }));
                }}
                name="youtubeUrl"
              />
              <p className="text-xs text-gray-500 mt-1">
                If a YouTube URL is provided, the image will be hidden.              </p>
            </div>
          </div>
        </form>
        <form>
          {/* File Upload Section */}
          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            <label
              htmlFor="upload33"
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
              // onChange={(e) => setCard3Image(e.target.files[0])}
              onChange={(e) => {
                const file = e.target.files[0];
                const result = validateFile(file);
                if (!result.valid) {
                  alert(result.message);
                  return;
                }
                setCard3Image(file);
              }}
              id="upload33"
              name="card3Image"
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
          {/* Image Preview */}
          {card3Image && (
            <div className="mt-4">
              <img
                src={
                  typeof card3Image === "string"
                    ? card3Image
                    : URL.createObjectURL(card3Image)
                }
                alt="Preview"
                className="w-36 h-auto"
              />
            </div>
          )}

          {/* Text Input Fields */}
          <div className="mt-8">
            <div className="mb-4">
              <h1 className="text-black"> Descripion </h1>
              <input
                type="text"
                placeholder="Alt Text"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card3?.description || ""}
                onChange={onChangeHandler3}
                name="description"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">YOUTUBE URL (optional)</h1>
              <input
                type="text"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card3.youtubeUrl || ""}
                onChange={(e) => {
                  const converted = convertToEmbedUrl(e.target.value);
                  setCard3((data) => ({ ...data, youtubeUrl: converted }));
                }}
                name="youtubeUrl"
              />
              <p className="text-xs text-gray-500 mt-1">
                If a YouTube URL is provided, the image will be hidden.              </p>
            </div>
          </div>
        </form>
        <form>
          {/* File Upload Section */}
          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            <label
              htmlFor="upload34"
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
              // onChange={(e) => setCard4Image(e.target.files[0])}
              onChange={(e) => {
                const file = e.target.files[0];
                const result = validateFile(file);
                if (!result.valid) {
                  alert(result.message);
                  return;
                }
                setCard4Image(file);
              }}
              id="upload34"
              name="card4Image"
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
          {/* Image Preview */}
          {card4Image && (
            <div className="mt-4">
              <img
                src={
                  typeof card4Image === "string"
                    ? card4Image
                    : URL.createObjectURL(card4Image)
                }
                alt="Preview"
                className="w-36 h-auto"
              />
            </div>
          )}

          {/* Text Input Fields */}
          <div className="mt-8">
            <div className="mb-4">
              <h1 className="text-black"> Descripion </h1>
              <input
                type="text"
                placeholder="Alt Text"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card4?.description || ""}
                onChange={onChangeHandler4}
                name="description"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">YOUTUBE URL (optional)</h1>
              <input
                type="text"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card4.youtubeUrl || ""}
                onChange={(e) => {
                  const converted = convertToEmbedUrl(e.target.value);
                  setCard4((data) => ({ ...data, youtubeUrl: converted }));
                }}
                name="youtubeUrl"
              />
              <p className="text-xs text-gray-500 mt-1">
                If a YouTube URL is provided, the image will be hidden.              </p>
            </div>
          </div>
        </form>
        <form>
          {/* File Upload Section */}
          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            <label
              htmlFor="upload35"
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
              // onChange={(e) => setCard5Image(e.target.files[0])}
              onChange={(e) => {
                const file = e.target.files[0];
                const result = validateFile(file);
                if (!result.valid) {
                  alert(result.message);
                  return;
                }
                setCard5Image(file);
              }}
              id="upload35"
              name="card5Image"
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
          {/* Image Preview */}
          {card5Image && (
            <div className="mt-4">
              <img
                src={
                  typeof card5Image === "string"
                    ? card5Image
                    : URL.createObjectURL(card5Image)
                }
                alt="Preview"
                className="w-36 h-auto"
              />
            </div>
          )}

          {/* Text Input Fields */}
          <div className="mt-8">
            <div className="mb-4">
              <h1 className="text-black"> Descripion </h1>
              <input
                type="text"
                placeholder="Alt Text"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card5?.description || ""}
                onChange={onChangeHandler5}
                name="description"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">YOUTUBE URL (optional)</h1>
              <input
                type="text"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card5.youtubeUrl || ""}
                onChange={(e) => {
                  const converted = convertToEmbedUrl(e.target.value);
                  setCard5((data) => ({ ...data, youtubeUrl: converted }));
                }}
                name="youtubeUrl"
              />
              <p className="text-xs text-gray-500 mt-1">
                If a YouTube URL is provided, the image will be hidden.              </p>
            </div>
          </div>
        </form>
        <form>
          {/* File Upload Section */}
          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            <label
              htmlFor="upload36"
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
              // onChange={(e) => setCard6Image(e.target.files[0])}
              onChange={(e) => {
                const file = e.target.files[0];
                const result = validateFile(file);
                if (!result.valid) {
                  alert(result.message);
                  return;
                }
                setCard6Image(file);
              }}
              id="upload36"
              name="card6Image"
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
          {/* Image Preview */}
          {card6Image && (
            <div className="mt-4">
              <img
                src={
                  typeof card6Image === "string"
                    ? card6Image
                    : URL.createObjectURL(card6Image)
                }
                alt="Preview"
                className="w-36 h-auto"
              />
            </div>
          )}

          {/* Text Input Fields */}
          <div className="mt-8">
            <div className="mb-4">
              <h1 className="text-black"> Descripion </h1>
              <input
                type="text"
                placeholder="Alt Text"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card6?.description || ""}
                onChange={onChangeHandler6}
                name="description"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">YOUTUBE URL (optional)</h1>
              <input
                type="text"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={card6.youtubeUrl || ""}
                onChange={(e) => {
                  const converted = convertToEmbedUrl(e.target.value);
                  setCard6((data) => ({ ...data, youtubeUrl: converted }));
                }}
                name="youtubeUrl"
              />
              <p className="text-xs text-gray-500 mt-1">
                If a YouTube URL is provided, the image will be hidden.              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCards;
