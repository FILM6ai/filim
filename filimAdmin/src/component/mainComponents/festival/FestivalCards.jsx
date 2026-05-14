import { validateFile } from "@/utils/fileValidation";
import React from "react";

const FestivalCards = ({
  cards,
  setCards,
  mainTitle,
  setMainTitle,
  showCardPopup,
  setShowCardPopup,
  popupIndex,
  tempCard,
  setTempCard,
  openCardPopup,
  saveCard,
  festivalId,
}) => {

  // Single card delete karna
  const handleDeleteCard = async (idx) => {
    if (!confirm("Are you sure you want to delete this card?")) return;

    if (festivalId) {
      try {
        const axios = (await import("axios")).default;
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/festival/deletecard/${festivalId}`,
          { data: { cardIndex: idx } }
        );
      } catch (err) {
        alert("Delete failed");
        return;
      }
    }

    const updated = cards.filter((_, i) => i !== idx);
    setCards(updated);
  };

  return (
    <div className="border p-4 mt-12">
      <div className="my-6">
        <h1 className="text-center text-3xl pb-3">Data For Awards</h1>

        <label className="block mb-2 font-medium">Main Title</label>
        <input
          type="text"
          value={mainTitle}
          onChange={(e) => setMainTitle(e.target.value)}
          className="border px-3 py-2 w-full mb-4"
        />

        <h3 className="mt-4 text-gray-500 text-sm">
          Click on cards to edit them. Use the ✕ button to delete.
        </h3>

        <div className="mt-4 grid max-sm:grid-cols-1 grid-cols-2 gap-4">
          {cards.map((card, idx) => (
            <div key={idx} className="border p-3 relative">
              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleDeleteCard(idx)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                title="Delete card"
              >
                ✕
              </button>

              {/* Card image preview */}
              {card.image && (
                <img
                  src={
                    typeof card.image === "string"
                      ? card.image
                      : URL.createObjectURL(card.image)
                  }
                  alt={card.title}
                  className="max-h-32 object-contain mb-2"
                />
              )}

              <button
                type="button"
                onClick={() => openCardPopup(idx)}
                className="w-full text-left font-medium text-blue-600 hover:underline"
              >
                {card.title || `Card ${idx + 1} (Edit)`}
              </button>
              {card.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {card.description}
                </p>
              )}
            </div>
          ))}

          {/* Add New Card Button */}
          <div className="border-2 border-dashed border-blue-400 p-3 flex items-center justify-center">
            <button
              type="button"
              onClick={() => openCardPopup(cards.length)}
              className="text-blue-600 font-semibold text-2xl hover:text-blue-800"
              title="New card add karein"
            >
              + Add New Card
            </button>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showCardPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-semibold">
              {popupIndex < cards.length
                ? `Edit Card ${popupIndex + 1}`
                : "New Card Add Karein"}
            </h2>

            <div className="mb-3">
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                value={tempCard.title}
                onChange={(e) =>
                  setTempCard({ ...tempCard, title: e.target.value })
                }
                className="border px-3 py-2 w-full"
                placeholder="Card title"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                value={tempCard.description}
                onChange={(e) =>
                  setTempCard({ ...tempCard, description: e.target.value })
                }
                className="border px-3 py-2 w-full"
                rows={3}
                placeholder="Card description"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Image / Video</label>
              <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
                <label
                  htmlFor="upload_card_popup"
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
                  <span className="text-gray-600 font-medium text-sm">Upload</span>
                  <span className="text-xs text-gray-500">Max: 5MB</span>
                </label>
                <input
                  type="file"
                  id="upload_card_popup"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const result = validateFile(file);
                    if (!result.valid) {
                      alert(result.message);
                      return;
                    }
                    setTempCard({ ...tempCard, image: file });
                  }}
                />
              </div>

              {tempCard.image && (
                <img
                  src={
                    typeof tempCard.image === "string"
                      ? tempCard.image
                      : URL.createObjectURL(tempCard.image)
                  }
                  alt="Preview"
                  className="mt-2 max-h-32 object-contain"
                />
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCardPopup(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveCard}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalCards;