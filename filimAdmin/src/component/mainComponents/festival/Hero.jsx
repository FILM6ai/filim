"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Advancing from "./Advancing";
import TopListing from "./TopListing";
import Robot from "./Robot";
import Competition from "./Competition";
import Runway from "./Runway";
import FestivalCards from "./FestivalCards";
import { validateFile } from "@/utils/fileValidation";

const Hero = () => {
  const [festivalId, setFestivalId] = useState(null);
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const [mainTitle, setMainTitle] = useState("");
  const [cards, setCards] = useState([]);
  const [showCardPopup, setShowCardPopup] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);
  const [tempCard, setTempCard] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const [advance, setAdvance] = useState({
    alt: "",
    title: "",
    title2: "",
    description: "",
  });

  const [advanceImage, setAdvanceImage] = useState(false);

  const [toplist, setToplist] = useState({
    alt: "",
    title: "",
    description: "",
    button: "",
    link: "",
  });

  const [toplistImage, setToplistImage] = useState(false);

  const [robot, setRobot] = useState({
    alt: "",
    title: "",
    description: "",
    button: "",
    link: "",
  });

  const [robotImage, setRobotImage] = useState(false);

  const [competate, setCompetate] = useState({
    alt: "",
    description: "",
    title: "",
    button: "",
    link: "",
  });

  const [competateImage, setCompetateImage] = useState(false);

  const [runway, setRunway] = useState({
    alt: "",
    title: "",
    button: "",
    link: "",
  });

  const [runwayImage, setRunwayImage] = useState(false);
  const [oldAdvanceImage, setOldAdvanceImage] = useState([]);
  const [oldToplistImage, setOldToplistImage] = useState([]);
  const [oldRobotImage, setOldRobotImage] = useState([]);
  const [oldCompetateImage, setOldCompetateImage] = useState([]);
  const [oldRunwayImage, setOldRunwayImage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/festival/getfestival`,
        );
        console.log(data.festival[0], "response get api");

        const homeData = data.festival[0];
        if (homeData) {
          setFestivalId(homeData._id);
          if (homeData?.hero) {
            setTitle(homeData.hero.title || "");
            setImage(homeData.hero.bgImage || "");
            setAlt(homeData.hero.alt || "");
            setDescription(homeData.hero.description || "");
          }
          if (homeData?.advance) {
            setAdvance(homeData.advance);
            setOldAdvanceImage(homeData.advance.bgImage || []);
            setAdvanceImage(null);
          }
          if (homeData?.toplist) {
            setToplist(homeData.toplist);
            setOldToplistImage(homeData.toplist.bgImage || []);
            setToplistImage(null);
          }
          if (homeData?.robot) {
            setRobot(homeData.robot);
            setOldRobotImage(homeData.robot.bgImage || []);
            setRobotImage(null);
          }
          if (homeData?.competate) {
            setCompetate(homeData.competate);
            setOldCompetateImage(homeData.competate.bgImage || []);
            setCompetateImage(null);
          }
          if (homeData?.runway) {
            setRunway(homeData.runway);
            setOldRunwayImage(homeData.runway.bgImage || []);
            setRunwayImage(null);
          }
          if (homeData?.cardSection) {
            setMainTitle(homeData.cardSection?.mainTitle || "");
            setCards(homeData.cardSection?.cards || []);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, []);
  const openCardPopup = (index) => {
    if (index < cards.length) {
      setTempCard(cards[index]);
    } else {
      setTempCard({ title: "", description: "", image: null });
    }
    setPopupIndex(index);
    setShowCardPopup(true);
  };

  // Save card from popup
  const saveCard = () => {
  const updated = [...cards];
  if (popupIndex < updated.length) {
    // Existing card edit
    updated[popupIndex] = tempCard;
  } else {
    // Naya card add
    updated.push(tempCard);
  }
  setCards(updated);           // ← 4 ki limit hata di
  setShowCardPopup(false);
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      const hero = { title, alt, description };
      formData.append("hero", JSON.stringify(hero));
      formData.append("cardSection", JSON.stringify({ mainTitle, cards }));

      formData.append("advance", JSON.stringify(advance));
      formData.append("toplist", JSON.stringify(toplist));
      formData.append("robot", JSON.stringify(robot));
      formData.append("competate", JSON.stringify(competate));
      formData.append("runway", JSON.stringify(runway));

      if (image) {
  formData.append("heroImage", image);
}
// Cards images hero image se bahar nikalo — hamesha append ho
cards.forEach((card, i) => {
  if (card.image && typeof card.image !== "string") {
    formData.append(`cardImage${i}`, card.image);
  }
});
      if (advanceImage) {
        formData.append("advanceImage", advanceImage);
      }
      if (toplistImage) {
        formData.append("toplistImage", toplistImage);
      }
      if (robotImage) {
        formData.append("robotImage", robotImage);
      }
      if (competateImage) {
        formData.append("competateImage", competateImage);
      }
      if (runwayImage) {
        formData.append("runwayImage", runwayImage);
      }

      // Call update API using PUT if festivalId exists
      if (festivalId) {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/festival/updatefestival/${festivalId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        const updatedFestivalData = response.data.festival;
        if (updatedFestivalData) {
          setOldAdvanceImage(updatedFestivalData.advance?.bgImage || []);
          setAdvanceImage(null);
          setOldToplistImage(updatedFestivalData.toplist?.bgImage || []);
          setToplistImage(null);
          setOldRobotImage(updatedFestivalData.robot?.bgImage || []);
          setRobotImage(null);
          setOldCompetateImage(updatedFestivalData.competate?.bgImage || []);
          setCompetateImage(null);
          setOldRunwayImage(updatedFestivalData.runway?.bgImage || []);
          setRunwayImage(null);
        }
        toast.success("Festival data updated successfully!");
        console.log("Response:", response.data);
      } else {
        // Fallback: create new service page if no id exists yet
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/festival/festivalRoute`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setFestivalId(response.data.festival._id);
        toast.success("Hero data created successfully!");
        console.log("Response:", response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className=" p-4 border">
        <h1 className="mt-4 mb-12 text-center text-3xl font-semibold">
          Header{" "}
        </h1>{" "}
        <form>
          {" "}
          <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
            {" "}
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
                alt="Preview"
                className="w-36 h-auto"
              />
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
              <h1 className="text-black">Description</h1>
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
      {/* Other components on the home page */}
      <Advancing
        advance={advance}
        setAdvance={setAdvance}
        advanceImage={advanceImage}
        setAdvanceImage={setAdvanceImage}
        festivalId={festivalId}
        oldAdvanceImage={oldAdvanceImage}
        setOldAdvanceImage={setOldAdvanceImage}
        sectionName="advance"
      />
      <TopListing
        toplist={toplist}
        setToplist={setToplist}
        toplistImage={toplistImage}
        setToplistImage={setToplistImage}
        festivalId={festivalId}
        oldToplistImage={oldToplistImage}
        setOldToplistImage={setOldToplistImage}
        sectionName="toplist"
      />
      <Robot
        robot={robot}
        setRobot={setRobot}
        robotImage={robotImage}
        setRobotImage={setRobotImage}
        festivalId={festivalId}
        oldRobotImage={oldRobotImage}
        setOldRobotImage={setOldRobotImage}
        sectionName="robot"
      />
      <Competition
        competate={competate}
        setCompetate={setCompetate}
        competateImage={competateImage}
        setCompetateImage={setCompetateImage}
        festivalId={festivalId}
        oldCompetateImage={oldCompetateImage}
        setOldCompetateImage={setOldCompetateImage}
        sectionName="competate"
      />

      <FestivalCards
        cards={cards}
        setCards={setCards}
        mainTitle={mainTitle}
        setMainTitle={setMainTitle}
        showCardPopup={showCardPopup}
        setShowCardPopup={setShowCardPopup}
        popupIndex={popupIndex}
        setPopupIndex={setPopupIndex}
        tempCard={tempCard}
        setTempCard={setTempCard}
        openCardPopup={openCardPopup}
        saveCard={saveCard}
        festivalId={festivalId}
      />
      <Runway
        runway={runway}
        setRunway={setRunway}
        runwayImage={runwayImage}
        setRunwayImage={setRunwayImage}
        festivalId={festivalId}
        oldRunwayImage={oldRunwayImage}
        setOldRunwayImage={setOldRunwayImage}
        sectionName="runway"
      />
      <div className="flex justify-end mt-8 mb-8">
        <button
          onClick={handleSubmit}
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white px-12 py-2 rounded-sm text-right"
        >
          {loading ? "Loading..." : festivalId ? "Update" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Hero;
