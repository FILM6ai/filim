"use client";
import { validateFile } from "@/utils/fileValidation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const defaultPopup = {
  title: "", content: "", tagline: "", heading: "",
  description: "", buttonText: "", buttonLink: "", image: "", youtubeUrl: "",
};

const Robot = ({
  robot,
  setRobot,
  robotImage,
  setRobotImage,
  festivalId,
  oldRobotImage,
  setOldRobotImage,
  sectionName,
  popupImageFile,
  setPopupImageFile,
}) => {
  const [showPopupEditor, setShowPopupEditor] = useState(false);
  const [popupForm, setPopupForm] = useState(robot.popup || defaultPopup);

  useEffect(() => {
    setPopupForm(robot.popup || defaultPopup);
  }, [robot.popup]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name.startsWith("popup.")) {
      const key = name.split(".")[1];
      setPopupForm((data) => ({ ...data, [key]: value }));
      return;
    }
    setRobot((data) => ({ ...data, [name]: value }));
  };

  const savePopup = () => {
    setRobot((data) => ({ ...data, popup: { ...popupForm } }));
    setShowPopupEditor(false);
  };

  const closePopupEditor = () => {
    setPopupForm(robot.popup || defaultPopup);
    setPopupImageFile(null);
    setShowPopupEditor(false);
  };

  return (
    <div>
      <div className="p-4 border mt-12">
        <h1 className="mt-4 mb-12 text-center text-3xl font-semibold">
          SECTION 3
        </h1>
        <form>
          {/* File Upload Section */}
          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            <label
              htmlFor="upload5"
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
              // onChange={(e) => setRobotImage(e.target.files[0])}
              onChange={(e) => {
                const file = e.target.files[0];
                const result = validateFile(file);
                if (!result.valid) {
                  alert(result.message);
                  return;
                }
                setRobotImage(file);
              }}
              id="upload5"
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
          {robotImage && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-green-600 mb-1">
                uploaded image
              </h2>
              <img
                src={
                  robotImage instanceof File
                    ? URL.createObjectURL(robotImage)
                    : robotImage
                }
                alt="Preview"
                className="w-36 h-auto"
              />
            </div>
          )}
          {oldRobotImage && oldRobotImage.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-500 mb-1">
                OLD IMAGES
              </h2>
              <div className="flex gap-2 flex-wrap">
                {[...oldRobotImage].reverse().map((url, index) => (
                  <div key={index} className="relative w-36">
                    <img src={url} alt="Old" className="w-36 h-auto" />
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/festival/deleteimage/${festivalId}`,
                            {
                              data: {
                                section: sectionName,
                                field: "bgImage",
                                imageUrl: url,
                              },
                            },
                          );
                          setOldRobotImage((prev) =>
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
                value={robot.alt}
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
                value={robot.title}
                onChange={onChangeHandler}
                name="title"
              />
            </div>
            <div className="mb-4 mt-4">
              <h1 className="text-black">DESCRIPTION</h1>
              <textarea
                placeholder="Description"
                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                value={robot.description}
                onChange={onChangeHandler}
                name="description"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">BUTTON</h1>
              <input
                type="text"
                placeholder="Button"
                className="border border-black px-3 py-2 mt-2 outline-0"
                value={robot.button}
                onChange={onChangeHandler}
                name="button"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-black">LINK URL</h1>
              <input
                type="text"
                placeholder="link url"
                className="border border-black px-3 py-2 mt-2 outline-0"
                value={robot.link}
                onChange={onChangeHandler}
                name="link"
              />
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <button type="button" onClick={() => setShowPopupEditor(true)} className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900">
                Edit Section 3 Popup
              </button>
              {robot.popup && (robot.popup.heading || robot.popup.description) && (
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm">
                  <p className="text-sm font-semibold text-gray-700">Popup preview</p>
                  {robot.popup.heading && <h3 className="mt-2 text-lg font-bold text-black">{robot.popup.heading}</h3>}
                  {robot.popup.description && <p className="text-sm text-gray-600">{robot.popup.description}</p>}
                </div>
              )}
            </div>
            {showPopupEditor && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="relative w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl" style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">Edit Section 3 Popup</h2>
                      <p className="text-sm text-gray-600">Section 3 ka alag popup content.</p>
                    </div>
                    <button type="button" onClick={closePopupEditor} className="rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">Close</button>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-black">Popup Tagline</label>
                      <input type="text" name="popup.tagline" value={popupForm.tagline || ""} onChange={onChangeHandler} placeholder="e.g. Special Offer" className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-black">Popup Heading</label>
                      <input type="text" name="popup.heading" value={popupForm.heading || ""} onChange={onChangeHandler} placeholder="Heading" className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-black">Popup Description</label>
                      <textarea name="popup.description" value={popupForm.description || ""} onChange={onChangeHandler} placeholder="Description" className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-black min-h-[140px]" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-black">Popup Image (optional)</label>
                        <label htmlFor="robotPopupImageUpload" className="flex h-12 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer">
                          {popupImageFile ? popupImageFile.name : popupForm.image ? "Change image" : "Upload image"}
                        </label>
                        <input id="robotPopupImageUpload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setPopupImageFile(file);
                          setPopupForm((data) => ({ ...data, image: URL.createObjectURL(file) }));
                        }} />
                        {popupForm.image && <img src={popupForm.image} alt="Preview" className="mt-3 h-28 w-full rounded object-cover" />}
                        {popupForm.image && (
                          <button type="button" onClick={() => { setPopupForm((data) => ({ ...data, image: "" })); setPopupImageFile(null); }} className="mt-2 rounded bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">Remove popup image</button>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-black">YouTube URL (optional)</label>
                        <input type="text" name="popup.youtubeUrl" value={popupForm.youtubeUrl || ""} onChange={onChangeHandler} placeholder="https://youtu.be/..." className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-black">Button Text</label>
                        <input type="text" name="popup.buttonText" value={popupForm.buttonText || ""} onChange={onChangeHandler} placeholder="e.g. LEARN MORE" className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-black">Button Link</label>
                        <input type="text" name="popup.buttonLink" value={popupForm.buttonLink || ""} onChange={onChangeHandler} placeholder="https://example.com" className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end gap-3">
                    <button type="button" onClick={closePopupEditor} className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700">Cancel</button>
                    <button type="button" onClick={savePopup} className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">Save Popup</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Robot;
