"use client";
import React from "react";

const GlossarySection = ({
    glossary,
    setGlossary,
}) => {
    const handleMainTitleChange = (e) => {
        setGlossary((prev) => ({ ...prev, mainTitle: e.target.value }));
    };

    const handleSubtitleChange = (e) => {
        setGlossary((prev) => ({ ...prev, subtitle: e.target.value }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...(glossary.items || [])];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setGlossary((prev) => ({ ...prev, items: updatedItems }));
    };

    const addItem = () => {
        setGlossary((prev) => ({
            ...prev,
            items: [...(prev.items || []), { term: "", definition: "" }],
        }));
    };

    const removeItem = (index) => {
        const updatedItems = (glossary.items || []).filter((_, i) => i !== index);
        setGlossary((prev) => ({ ...prev, items: updatedItems }));
    };

    return (
        <div className="p-4 border mt-12">
            <h1 className="mt-4 mb-12 text-center text-3xl font-semibold">
                GLOSSARY SECTION
            </h1>

            <div className="mb-4">
                <h1 className="text-black">MAIN TITLE</h1>
                <input
                    type="text"
                    placeholder="e.g. Rules & Terms"
                    className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                    value={glossary.mainTitle || ""}
                    onChange={handleMainTitleChange}
                />
            </div>

            <div className="mb-4">
                <h1 className="text-black">SUBTITLE (optional, e.g. SUBMISSIONS)</h1>
                <input
                    type="text"
                    placeholder="Subtitle"
                    className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                    value={glossary.subtitle || ""}
                    onChange={handleSubtitleChange}
                />
            </div>

            <div className="mt-8">
                <h2 className="text-black font-semibold mb-4">ITEMS</h2>
                {(glossary.items || []).map((item, index) => (
                    <div key={index} className="border p-4 mb-4 relative">
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1"
                        >
                            ✕
                        </button>
                        <p className="text-gray-500 text-sm mb-2">
                            Item {String(index + 1).padStart(2, "0")}
                        </p>
                        <div className="mb-3">
                            <h1 className="text-black">TERM (Title)</h1>
                            <input
                                type="text"
                                placeholder="e.g. Eligibility"
                                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                                value={item.term || ""}
                                onChange={(e) => handleItemChange(index, "term", e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <h1 className="text-black">DEFINITION (Description)</h1>
                            <textarea
                                placeholder="Definition..."
                                className="border border-black px-3 py-2 mt-2 outline-0 w-full"
                                rows={3}
                                value={item.definition || ""}
                                onChange={(e) => handleItemChange(index, "definition", e.target.value)}
                            />
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addItem}
                    className="border-2 border-dashed border-blue-400 text-blue-600 font-semibold px-6 py-3 w-full hover:bg-blue-50"
                >
                    + Add New Item
                </button>
            </div>
        </div>
    );
};

export default GlossarySection;