"use client";
import React, { useRef } from "react";

const JurorsSection = ({ jurors, setJurors, festivalId }) => {
    const fileInputRefs = useRef({});

    const handleTitleChange = (e) => {
        setJurors((prev) => ({ ...prev, mainTitle: e.target.value }));
    };

    const handleItemChange = (index, field, value) => {
        const updated = [...(jurors.items || [])];
        updated[index] = { ...updated[index], [field]: value };
        setJurors((prev) => ({ ...prev, items: updated }));
    };

    const handleImageChange = (index, file) => {
        const updated = [...(jurors.items || [])];
        updated[index] = { ...updated[index], image: file };
        setJurors((prev) => ({ ...prev, items: updated }));
    };

    const addItem = () => {
        setJurors((prev) => ({
            ...prev,
            items: [...(prev.items || []), { name: "", role: "", image: null }],
        }));
    };

    const removeItem = (index) => {
        const updated = (jurors.items || []).filter((_, i) => i !== index);
        setJurors((prev) => ({ ...prev, items: updated }));
    };

    return (
        <div className="p-4 border mt-12">
            <h1 className="mt-4 mb-12 text-center text-3xl font-semibold">
                JURORS SECTION
            </h1>

            <div className="mb-4">
                <h1 className="text-black">MAIN TITLE</h1>
                <input
                    type="text"
                    placeholder="e.g. Meet The Jurors"
                    className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                    value={jurors.mainTitle || ""}
                    onChange={handleTitleChange}
                />
            </div>

            <div className="mt-8">
                <h2 className="text-black font-semibold mb-4">JURORS</h2>
                {(jurors.items || []).map((item, index) => (
                    <div key={index} className="border p-4 mb-4 relative">
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1"
                        >
                            ✕
                        </button>
                        <p className="text-gray-500 text-sm mb-3">
                            Juror {String(index + 1).padStart(2, "0")}
                        </p>

                        <div className="mb-3">
                            <h1 className="text-black">IMAGE</h1>
                            <div
                                className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36 cursor-pointer mt-2"
                                onClick={() => fileInputRefs.current[index]?.click()}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 fill-white stroke-indigo-500"
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
                                    <span className="text-gray-600 text-xs font-medium">
                                        Upload Image
                                    </span>
                                </div>
                                <input
                                    ref={(el) => (fileInputRefs.current[index] = el)}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                                />
                            </div>
                            {item.image && (
                                <img
                                    src={
                                        typeof item.image === "string"
                                            ? item.image
                                            : URL.createObjectURL(item.image)
                                    }
                                    alt="preview"
                                    className="mt-2 w-28 h-28 object-cover"
                                />
                            )}
                        </div>

                        <div className="mb-3">
                            <h1 className="text-black">NAME</h1>
                            <input
                                type="text"
                                placeholder="e.g. John Smith"
                                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                                value={item.name || ""}
                                onChange={(e) =>
                                    handleItemChange(index, "name", e.target.value)
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <h1 className="text-black">ROLE</h1>
                            <input
                                type="text"
                                placeholder="e.g. Creative Director"
                                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                                value={item.role || ""}
                                onChange={(e) =>
                                    handleItemChange(index, "role", e.target.value)
                                }
                            />
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addItem}
                    className="border-2 border-dashed border-blue-400 text-blue-600 font-semibold px-6 py-3 w-full hover:bg-blue-50"
                >
                    + Add New Juror
                </button>
            </div>
        </div>
    );
};

export default JurorsSection;