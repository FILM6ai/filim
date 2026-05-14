import { uploadOnCloudinary } from "../utils/cloudinary.js";
import studioSchema from "../modles/studio.js";
export const createStudioPage = async (req, res) => {
  try {
    const {
      hero,
      advance,
      card1,
      card2,
      card3,
      card4,
      card5,
      card6,
      toplist,
      toplist2,
      competate,
      competate2,
      toplist3,
      competate3,
    } = req.body;
    console.log(req.body, "REQ.BODY");
    if (
      !hero ||
      !advance ||
      !toplist ||
      !competate ||
      !toplist3 ||
      !competate3
    ) {
      console.error("One or more required fields are missing:", {
        hero,
        advance,
        toplist,
        competate,
        toplist3,
        competate3,
      });
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const hero1 = hero ? JSON.parse(hero) : null;
    const advance1 = advance ? JSON.parse(advance) : null;
    const card11 = card1 ? JSON.parse(card1) : null;
    const card22 = card2 ? JSON.parse(card2) : null;
    const card33 = card3 ? JSON.parse(card3) : null;
    const card44 = card4 ? JSON.parse(card4) : null;
    const card55 = card5 ? JSON.parse(card5) : null;
    const card66 = card6 ? JSON.parse(card6) : null;
    const topList1 = toplist ? JSON.parse(toplist) : null;
    const toplisted = toplist2 ? JSON.parse(toplist2) : null;
    const competate1 = competate ? JSON.parse(competate) : null;
    const competated = competate2 ? JSON.parse(competate2) : null;
    const topList3 = toplist3 ? JSON.parse(toplist3) : null;
    const competated3 = competate3 ? JSON.parse(competate3) : null;

    // let heroVideoPath = req.files?.heroImage[0]?.path;
    let heroVideoPath = req.files?.heroImage?.map((file) => file.path) || [];

    let uploadedVideos = await Promise.all(
      heroVideoPath.map((path) =>
        uploadOnCloudinary(path, { resource_type: "video" }),
      ),
    );
    console.log(req.files, "card1Image");
    let card1Image = req.files?.card1Image?.[0]?.path;
    let card2Image = req.files?.card2Image?.[0]?.path;
    let card3Image = req.files?.card3Image?.[0]?.path;
    let card4Image = req.files?.card4Image?.[0]?.path;
    let card5Image = req.files?.card5Image?.[0]?.path;
    let card6Image = req.files?.card6Image?.[0]?.path;
    let toplistImage = req.files?.toplistImage?.[0]?.path;
    let toplistImage2 = req.files?.toplistImage2?.[0]?.path;
    let competateImage = req.files?.competateImage?.[0]?.path;
    let competateImage2 = req.files?.competateImage2?.[0]?.path;
    let toplistImage3 = req.files?.toplistImage3?.[0]?.path;
    let competateImage3 = req.files?.competateImage3?.[0]?.path;

    console.log(card1Image, "card1Image");
    console.log(card2Image, "card2Image");

    if (heroVideoPath) {
      heroVideoPath = await uploadOnCloudinary(heroVideoPath, {
        resource_type: "video",
      });
    }
    console.log(heroVideoPath, "cloud hero");

    if (card1Image) {
      card1Image = await uploadOnCloudinary(card1Image);
    }
    console.log(card1Image, "cloud card1");

    if (card2Image) {
      card2Image = await uploadOnCloudinary(card2Image);
    }
    console.log(card2Image, "cloud card2");

    if (card3Image) {
      card3Image = await uploadOnCloudinary(card3Image);
    }

    if (card4Image) {
      card4Image = await uploadOnCloudinary(card4Image);
    }

    if (card5Image) {
      card5Image = await uploadOnCloudinary(card5Image);
    }

    if (card6Image) {
      card6Image = await uploadOnCloudinary(card6Image);
    }

    if (toplistImage) {
      toplistImage = await uploadOnCloudinary(toplistImage);
    }

    if (toplistImage2) {
      toplistImage2 = await uploadOnCloudinary(toplistImage2);
    }

    if (competateImage) {
      competateImage = await uploadOnCloudinary(competateImage);
    }

    if (competateImage2) {
      competateImage2 = await uploadOnCloudinary(competateImage2);
    }

    if (toplistImage3) {
      toplistImage3 = await uploadOnCloudinary(toplistImage3);
    }

    if (competateImage3) {
      competateImage3 = await uploadOnCloudinary(competateImage3);
    }

    const newStudio = new studioSchema({
      hero: {
        bgImage: uploadedVideos.map((v) => v.secure_url),
        title: hero1.title,
        alt: hero1.alt,
        description: hero1.description,
      },
      advance: {
        title: advance1.title,
        title2: advance1.title2,
        description: advance1.description,
      },
      card1: {
        mainTitle: card11.mainTitle,
        description: card11.description,
        catogryImage: card1Image?.secure_url,
        youtubeUrl: card11.youtubeUrl || "",
      },
      card2: {
        description: card22.description,
        catogryImage: card2Image?.secure_url,
        youtubeUrl: card22.youtubeUrl || "",
      },
      card3: {
        description: card33.description,
        catogryImage: card3Image?.secure_url,
        youtubeUrl: card33.youtubeUrl || "",
      },
      card4: {
        description: card44.description,
        catogryImage: card4Image?.secure_url,
        youtubeUrl: card44.youtubeUrl || "",
      },
      card5: {
        description: card55.description,
        catogryImage: card5Image?.secure_url,
        youtubeUrl: card55.youtubeUrl || "",
      },
      card6: {
        description: card66.description,
        catogryImage: card6Image?.secure_url,
        youtubeUrl: card66.youtubeUrl || "",
      },
      toplist: {
        alt: topList1.alt,
        bgImage: toplistImage?.secure_url,
        title: topList1.title,
        genre: topList1.genre,
        line: topList1.line,
        description: topList1.description,
        description2: topList1.description2,
        button: topList1.button,
        link: topList1.link,
        youtubeUrl: topList1.youtubeUrl || "",
      },
      toplist2: {
        alt: toplisted.alt,
        bgImage: toplistImage2?.secure_url,
        title: toplisted.title,
        genre: toplisted.genre,
        line: toplisted.line,
        description: toplisted.description,
        description2: toplisted.description2,
        button: toplisted.button,
        link: toplisted.link,
        youtubeUrl: toplisted.youtubeUrl || "",
      },
      competate: {
        alt: competate1.alt,
        bgImage: competateImage?.secure_url,
        title: competate1.title,
        genre: competate1.genre,
        description: competate1.description,
        description2: competate1.description2,
        button: competate1.button,
        link: competate1.link,
        youtubeUrl: competate1.youtubeUrl || "",
      },
      competate2: {
        alt: competated.alt,
        bgImage: competateImage2?.secure_url,
        title: competated.title,
        genre: competated.genre,
        description: competated.description,
        description2: competated.description2,
        button: competated.button,
        link: competated.link,
        youtubeUrl: competated.youtubeUrl || "",
      },
      toplist3: {
        alt: topList3.alt,
        bgImage: toplistImage3?.secure_url,
        title: topList3.title,
        genre: topList3.genre,
        line: topList3.line,
        description: topList3.description,
        description2: topList3.description2,
        button: topList3.button,
        link: topList3.link,
        youtubeUrl: topList3.youtubeUrl || "",
      },
      competate3: {
        alt: competated3.alt,
        bgImage: competateImage3?.secure_url,
        title: competated3.title,
        genre: competated3.genre,
        description: competated3.description,
        description2: competated3.description2,
        button: competated3.button,
        link: competated3.link,
        youtubeUrl: competated3.youtubeUrl || "",
      },
    });
    const studio = await newStudio.save();

    res.status(200).json({
      success: true,
      studio,
      message: "studio page uploaded successfully",
    });
  } catch (error) {
    console.error("Error fetching studio:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch studio" });
  }
};

export const createGetStudio = async (req, res) => {
  try {
    const studio = await studioSchema.find({});
    console.log(studio, "studio");

    res.status(200).json({
      success: true,
      studio,
      message: "studio page get successfully",
    });
  } catch (error) {
    console.error("Error fetching studio:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch studio" });
  }
};

// UPDATE API

export const updateStudioPage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      hero,
      advance,
      toplist,
      toplist2,
      competate,
      competate2,
      toplist3,
      competate3,
      card1,
      card2,
      card3,
      card4,
      card5,
      card6,
    } = req.body;

    // Parse JSON data from request
    const hero1 = hero ? JSON.parse(hero) : {};
    const advance1 = advance ? JSON.parse(advance) : {};
    const card11 = card1 ? JSON.parse(card1) : {};
    const card22 = card2 ? JSON.parse(card2) : {};
    const card33 = card3 ? JSON.parse(card3) : {};
    const card44 = card4 ? JSON.parse(card4) : {};
    const card55 = card5 ? JSON.parse(card5) : {};
    const card66 = card6 ? JSON.parse(card6) : {};
    const topList1 = toplist ? JSON.parse(toplist) : {};
    const toplisted = toplist2 ? JSON.parse(toplist2) : {};
    const competate1 = competate ? JSON.parse(competate) : {};
    const competated = competate2 ? JSON.parse(competate2) : {};
    const topList3 = toplist3 ? JSON.parse(toplist3) : {};
    const competated3 = competate3 ? JSON.parse(competate3) : {};

    // Get file paths if provided
    // let heroVideoPath = req.files?.heroImage?.[0]?.path;
    let card1Image = req.files?.card1Image?.[0]?.path;
    let card2Image = req.files?.card2Image?.[0]?.path;
    let card3Image = req.files?.card3Image?.[0]?.path;
    let card4Image = req.files?.card4Image?.[0]?.path;
    let card5Image = req.files?.card5Image?.[0]?.path;
    let card6Image = req.files?.card6Image?.[0]?.path;
    let toplistImage = req.files?.toplistImage?.[0]?.path;
    let toplistImage2 = req.files?.toplistImage2?.[0]?.path;
    let competateImage = req.files?.competateImage?.[0]?.path;
    let competateImage2 = req.files?.competateImage2?.[0]?.path;
    let toplistImage3 = req.files?.toplistImage3?.[0]?.path;
    let competateImage3 = req.files?.competateImage3?.[0]?.path;

    // Upload new files if available
    let heroVideoPath = req.files?.heroImage?.map((file) => file.path) || [];

    let uploadedVideos = await Promise.all(
      heroVideoPath.map((path) =>
        uploadOnCloudinary(path, { resource_type: "video" }),
      ),
    );
    if (card1Image) {
      card1Image = await uploadOnCloudinary(card1Image);
    }

    if (card2Image) {
      card2Image = await uploadOnCloudinary(card2Image);
    }

    if (card3Image) {
      card3Image = await uploadOnCloudinary(card3Image);
    }

    if (card4Image) {
      card4Image = await uploadOnCloudinary(card4Image);
    }

    if (card5Image) {
      card5Image = await uploadOnCloudinary(card5Image);
    }

    if (card6Image) {
      card6Image = await uploadOnCloudinary(card6Image);
    }

    if (toplistImage) {
      toplistImage = await uploadOnCloudinary(toplistImage);
    }
    if (toplistImage2) {
      toplistImage2 = await uploadOnCloudinary(toplistImage2);
    }
    if (competateImage) {
      competateImage = await uploadOnCloudinary(competateImage);
    }
    if (competateImage2) {
      competateImage2 = await uploadOnCloudinary(competateImage2);
    }
    if (toplistImage3) {
      toplistImage3 = await uploadOnCloudinary(toplistImage3);
    }
    if (competateImage3) {
      competateImage3 = await uploadOnCloudinary(competateImage3);
    }
    // Retrieve the current studio document
    const currentStudio = await studioSchema.findById(id);
    if (!currentStudio) {
      return res
        .status(404)
        .json({ success: false, message: "Studio page not found" });
    }

    // Merge the current values with the new ones
    const updatedHero = {
      title: hero1.title,
      bgImage:
  uploadedVideos.length > 0
    ? [...(currentStudio.hero.bgImage || []), ...uploadedVideos.map((v) => v.secure_url)]
    : currentStudio.hero.bgImage || [],

      alt: hero1.alt,
      description: hero1.description,
    };

    const updatedAdvance = {
      title: advance1.title,
      title2: advance1.title2,
      description: advance1.description,
    };
    const updateCard1 = {
      mainTitle: card11.mainTitle ?? currentStudio.card1.mainTitle,
      description: card11.description,
      catogryImage: card1Image?.secure_url || currentStudio.card1.catogryImage,
      youtubeUrl: card11.youtubeUrl ?? currentStudio.card1.youtubeUrl ?? "",
    };
    const updateCard2 = {
      description: card22.description,
      catogryImage: card2Image?.secure_url || currentStudio.card2.catogryImage,
      youtubeUrl: card22.youtubeUrl ?? currentStudio.card2.youtubeUrl ?? "",
    };
    const updateCard3 = {
      description: card33.description,
      catogryImage: card3Image?.secure_url || currentStudio.card3.catogryImage,
      youtubeUrl: card33.youtubeUrl ?? currentStudio.card3.youtubeUrl ?? "",
    };
    const updateCard4 = {
      description: card44.description,
      catogryImage: card4Image?.secure_url || currentStudio.card4.catogryImage,
      youtubeUrl: card44.youtubeUrl ?? currentStudio.card4.youtubeUrl ?? "",
    };
    const updateCard5 = {
      description: card55.description,
      catogryImage: card5Image?.secure_url || currentStudio.card5.catogryImage,
      youtubeUrl: card55.youtubeUrl ?? currentStudio.card5.youtubeUrl ?? "",
    };
    const updateCard6 = {
      description: card66.description,
      catogryImage: card6Image?.secure_url || currentStudio.card6.catogryImage,
      youtubeUrl: card66.youtubeUrl ?? currentStudio.card6.youtubeUrl ?? "",
    };

    const updatedToplist = {
  alt: topList1.alt,
  title: topList1.title,
  genre: topList1.genre,
  line: topList1.line,
  description: topList1.description,
  description2: topList1.description2,
  button: topList1.button,
  bgImage: toplistImage?.secure_url
    ? [...(currentStudio.toplist.bgImage || []), toplistImage.secure_url]
    : currentStudio.toplist.bgImage || [],
  link: topList1.link,
        youtubeUrl: topList1.youtubeUrl ?? currentStudio.toplist.youtubeUrl ?? "",

};

    const updatedToplist2 = {
      alt: toplisted.alt,
      title: toplisted.title,
      genre: toplisted.genre,
      line: toplisted.line,
      description: toplisted.description,
      description2: toplisted.description2,
      button: toplisted.button,
      bgImage: toplistImage2?.secure_url
  ? [...(currentStudio.toplist2.bgImage || []), toplistImage2.secure_url]
  : currentStudio.toplist2.bgImage || [],
      link: toplisted.link,
      youtubeUrl: toplisted.youtubeUrl ?? currentStudio.toplist2.youtubeUrl ?? "",

    };

    const updatedCompetate = {
      alt: competate1.alt,
      title: competate1.title,
      genre: competate1.genre,
      description: competate1.description,
      description2: competate1.description2,
      button: competate1.button,
      bgImage: competateImage?.secure_url
  ? [...(currentStudio.competate.bgImage || []), competateImage.secure_url]
  : currentStudio.competate.bgImage || [],      link: competate1.link,
  youtubeUrl: competate1.youtubeUrl ?? currentStudio.competate.youtubeUrl ?? "",
    };

    const updatedCompetate2 = {
      alt: competated.alt,
      title: competated.title,
      genre: competated.genre,
      description: competated.description,
      description2: competated.description2,
      button: competated.button,
      bgImage: competateImage2?.secure_url
  ? [...(currentStudio.competate2.bgImage || []), competateImage2.secure_url]
  : currentStudio.competate2.bgImage || [],      link: competated.link,
  youtubeUrl: competated.youtubeUrl ?? currentStudio.competate2.youtubeUrl ?? "",
    };
    const updatedToplist3 = {
      alt: topList3.alt,
      title: topList3.title,
      genre: topList3.genre,
      line: topList3.line,
      description: topList3.description,
      description2: topList3.description2,
      button: topList3.button,
      bgImage: toplistImage3?.secure_url
  ? [...(currentStudio.toplist3.bgImage || []), toplistImage3.secure_url]
  : currentStudio.toplist3.bgImage || [],      link: topList3.link,
  youtubeUrl: topList3.youtubeUrl ?? currentStudio.toplist3.youtubeUrl ?? "",
    };

    const updatedCompetate3 = {
      alt: competated3.alt,
      title: competated3.title,
      genre: competated3.genre,
      description: competated3.description,
      description2: competated3.description2,
      button: competated3.button,
      bgImage: competateImage3?.secure_url
  ? [...(currentStudio.competate3.bgImage || []), competateImage3.secure_url]
  : currentStudio.competate3.bgImage || [],      link: competated3.link,
  youtubeUrl: competated3.youtubeUrl ?? currentStudio.competate3.youtubeUrl ?? "",
    };
    const updateData = {
      hero: updatedHero,
      advance: updatedAdvance,
      toplist: updatedToplist,
      toplist2: updatedToplist2,
      competate: updatedCompetate,
      competate2: updatedCompetate2,
      toplist3: updatedToplist3,
      competate3: updatedCompetate3,
      card1: updateCard1,
      card2: updateCard2,
      card3: updateCard3,
      card4: updateCard4,
      card5: updateCard5,
      card6: updateCard6,
    };

    // Update the document with merged data
    const updatedStudio = await studioSchema.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      studio: updatedStudio,
      message: "Studio page updated successfully",
    });
  } catch (error) {
    console.error("Error updating studio:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update studio" });
  }
};


export const deleteStudioImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { section, imageUrl, field } = req.body;

    const existingStudio = await studioSchema.findById(id);
    if (!existingStudio) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    let updateQuery = {};

    if (Array.isArray(existingStudio[section]?.[field])) {
      const updatedArr = existingStudio[section][field].filter(
        (url) => url !== imageUrl
      );
      updateQuery = { [`${section}.${field}`]: updatedArr };
    } else {
      updateQuery = { [`${section}.${field}`]: null };
    }

    const updated = await studioSchema.findByIdAndUpdate(
      id,
      { $set: updateQuery },
      { new: true }
    );

    return res.status(200).json({ success: true, studio: updated });
  } catch (error) {
    console.error("Delete image error:", error);
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};