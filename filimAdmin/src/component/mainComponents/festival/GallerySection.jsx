"use client";
import React, { useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GallerySection = ({
    galleryTitle,
    setGalleryTitle,
    galleryImages,      // new File[] — naye upload kiye
    setGalleryImages,
    oldGalleryImages,   // string[] — DB se aaye URLs
    setOldGalleryImages,
    festivalId,
}) => {
    const fileInputRef = useRef(null);

    const handleFilesChange = (e) => {
        const files = Array.from(e.target.files);
        // No size limit as per requirement
        setGalleryImages((prev) => [...prev, ...files]);
        e.target.value = ""; // reset so same file can be re-selected
    };

    const removeNewImage = (index) => {
        setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    };

    const deleteOldImage = async (url) => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/festival/deleteimage/${festivalId}`,
                {
                    data: {
                        section: "gallery",
                        field: "images",
                        imageUrl: url,
                    },
                }
            );
            setOldGalleryImages((prev) => prev.filter((u) => u !== url));
            toast.success("Image deleted!");
        } catch {
            toast.error("Delete failed!");
        }
    };

    return (
        <div className="p-4 border mt-12">
            <h1 className="mt-4 mb-12 text-center text-3xl font-semibold">
                GALLERY SECTION
            </h1>

            <div className="mb-6">
                <h1 className="text-black">GALLERY TITLE</h1>
                <input
                    type="text"
                    placeholder="e.g. Jurors"
                    className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                    value={galleryTitle || ""}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                />
            </div>

            {/* Upload Button */}
            <div
                className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-48 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="flex flex-col items-center gap-2">
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
                    <span className="text-gray-600 font-medium">Upload Images</span>
                    <span className="text-xs text-gray-500">Any format, no limit</span>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFilesChange}
                />
            </div>

            {/* New Images Preview */}
            {galleryImages && galleryImages.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-sm font-semibold text-green-600 mb-2">
                        NEW IMAGES (to be uploaded)
                    </h2>
                    <div className="flex gap-3 flex-wrap">
                        {galleryImages.map((file, index) => (
                            <div key={index} className="relative w-28">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`new-${index}`}
                                    className="w-28 h-20 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Old Images */}
            {oldGalleryImages && oldGalleryImages.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-sm font-semibold text-gray-500 mb-2">
                        EXISTING GALLERY IMAGES
                    </h2>
                    <div className="flex gap-3 flex-wrap">
                        {[...oldGalleryImages].reverse().map((url, index) => (
                            <div key={index} className="relative w-28">
                                <img
                                    src={url}
                                    alt={`old-${index}`}
                                    className="w-28 h-20 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => deleteOldImage(url)}
                                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GallerySection;