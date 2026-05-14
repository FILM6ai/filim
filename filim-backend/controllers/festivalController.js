import { uploadOnCloudinary } from "../utils/cloudinary.js";
import festivalSchema from "../modles/festival.js";
export const createFestivalPage = async (req, res) => {
  try {
    const { hero, advance, toplist, robot, competate, runway, cardSection } =
      req.body;
    const hero1 = JSON.parse(hero);
    const advance1 = JSON.parse(advance);
    const topList1 = JSON.parse(toplist);
    const robot1 = JSON.parse(robot);
    const competate1 = JSON.parse(competate);
    const runway1 = JSON.parse(runway);
    const cardSection1 = JSON.parse(cardSection);

    let heroVideoPath = req.files?.heroImage[0]?.path;
    let advanceImage = req.files?.advanceImage[0]?.path;
    let toplistImage = req.files?.toplistImage[0]?.path;
    let robotImage = req.files?.robotImage[0]?.path;
    let competateImage = req.files?.competateImage[0]?.path;
    let runwayImage = req.files?.runwayImage[0]?.path;

    let cardImages = [];
    const totalCards = cardSection1.cards.length;
for (let i = 0; i < totalCards; i++) {
      const file = req.files?.[`cardImage${i}`]?.[0]?.path;
      if (file) {
        const uploaded = await uploadOnCloudinary(file);
        cardImages.push(uploaded?.secure_url);
      } else {
        cardImages.push(null);
      }
    }

    if (heroVideoPath) {
      heroVideoPath = await uploadOnCloudinary(heroVideoPath, {
        resource_type: "video",
      });
    }
    console.log(heroVideoPath, "cloud hero");

    if (advanceImage) {
      advanceImage = await uploadOnCloudinary(advanceImage);
    }

    if (toplistImage) {
      toplistImage = await uploadOnCloudinary(toplistImage);
    }

    if (robotImage) {
      robotImage = await uploadOnCloudinary(robotImage);
    }

    if (competateImage) {
      competateImage = await uploadOnCloudinary(competateImage);
    }

    if (runwayImage) {
      runwayImage = await uploadOnCloudinary(runwayImage);
    }

    const newFestival = new festivalSchema({
      hero: {
        bgImage: heroVideoPath?.secure_url,
        title: hero1.title,
        alt: hero1.alt,
        description: hero1.description,
      },
      advance: {
        alt: advance1.alt,
        bgImage: advanceImage?.secure_url,
        title: advance1.title,
        title2: advance1.title2,
        description: advance1.description,
      },
      toplist: {
        alt: topList1.alt,
        bgImage: toplistImage?.secure_url,
        title: topList1.title,
        description: topList1.description,
        button: topList1.button,
        link: topList1.link,
      },
      robot: {
        alt: robot1.alt,
        bgImage: robotImage?.secure_url,
        title: robot1.title,
        description: robot1.description,
        button: robot1.button,
        link: robot1.link,
      },
      competate: {
        alt: competate1.alt,
        bgImage: competateImage?.secure_url,
        title: competate1.title,
        description: competate1.description,
        button: competate1.button,
        link: competate1.link,
      },
      cardSection: {
        mainTitle: cardSection1.mainTitle,
        cards: cardSection1.cards.map((card, index) => ({
          title: card.title,
          description: card.description,
          image: cardImages[index] || "",
        })),
      },
      runway: {
        alt: runway1.alt,
        bgImage: runwayImage?.secure_url,
        title: runway1.title,
        button: runway1.button,
        link: runway1.link,
      },
    });
    const festival = await newFestival.save();

    res.status(200).json({
      success: true,
      festival,
      message: "festival page uploaded successfully",
    });
  } catch (error) {
    console.error("Error fetching festival:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch festival" });
  }
};

export const createGetFestival = async (req, res) => {
  try {
    const festival = await festivalSchema.find({});
    console.log(festival, "home");

    res.status(200).json({
      success: true,
      festival,
      message: "festival page get successfully",
    });
  } catch (error) {
    console.error("Error fetching festival:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch festival" });
  }
};

// UPDATE

export const updatedFestival = async (req, res) => {
  try {
    const { id } = req.params;
    const existingFestival = await festivalSchema.findById(id);
    if (!existingFestival) {
      return res.status(404).json({
        success: false,
        message: "Festival page not found",
      });
    }

    const updates = {};
    console.log("Raw req.body:", req.body);

    // Update Hero section if provided
    if (req.body.hero) {
      let heroData = JSON.parse(req.body.hero);
      // If a new file is uploaded, process it.
      if (req.files && req.files.heroImage && req.files.heroImage.length) {
        const heroFilePath = req.files.heroImage[0].path;
        const uploadResult = await uploadOnCloudinary(heroFilePath, {
          resource_type: "video",
        });
        heroData.bgImage = uploadResult?.secure_url;
      } else {
        // If no new image is provided, preserve the existing bgImage.
        heroData.bgImage = existingFestival.hero?.bgImage;
      }
      updates.hero = heroData;
    }

    // Update Advance section if provided
    if (req.body.advance) {
      let advanceData = JSON.parse(req.body.advance);
      if (
        req.files &&
        req.files.advanceImage &&
        req.files.advanceImage.length
      ) {
        const advanceFilePath = req.files.advanceImage[0].path;
        const uploadResult = await uploadOnCloudinary(advanceFilePath);
        advanceData.bgImage = uploadResult?.secure_url
          ? [
              ...(existingFestival.advance?.bgImage || []),
              uploadResult.secure_url,
            ]
          : existingFestival.advance?.bgImage || [];
      } else {
        advanceData.bgImage = existingFestival.advance?.bgImage || [];
      }
      updates.advance = advanceData;
    }

    // Update Toplist section if provided
    if (req.body.toplist) {
      let toplistData = JSON.parse(req.body.toplist);
      if (
        req.files &&
        req.files.toplistImage &&
        req.files.toplistImage.length
      ) {
        const toplistFilePath = req.files.toplistImage[0].path;
        const uploadResult = await uploadOnCloudinary(toplistFilePath);
        toplistData.bgImage = uploadResult?.secure_url
          ? [
              ...(existingFestival.toplist?.bgImage || []),
              uploadResult.secure_url,
            ]
          : existingFestival.toplist?.bgImage || [];
      } else {
        toplistData.bgImage = existingFestival.toplist?.bgImage || [];
      }
      updates.toplist = toplistData;
    }

    // Update Robot section if provided
    if (req.body.robot) {
      let robotData = JSON.parse(req.body.robot);
      if (req.files && req.files.robotImage && req.files.robotImage.length) {
        const robotFilePath = req.files.robotImage[0].path;
        const uploadResult = await uploadOnCloudinary(robotFilePath);
        robotData.bgImage = uploadResult?.secure_url
          ? [
              ...(existingFestival.robot?.bgImage || []),
              uploadResult.secure_url,
            ]
          : existingFestival.robot?.bgImage || [];
      } else {
        robotData.bgImage = existingFestival.robot?.bgImage || [];
      }
      updates.robot = robotData;
    }

    // Update Competate section if provided
    if (req.body.competate) {
      let competateData = JSON.parse(req.body.competate);
      if (
        req.files &&
        req.files.competateImage &&
        req.files.competateImage.length
      ) {
        const competateFilePath = req.files.competateImage[0].path;
        const uploadResult = await uploadOnCloudinary(competateFilePath);
        competateData.bgImage = uploadResult?.secure_url
          ? [
              ...(existingFestival.competate?.bgImage || []),
              uploadResult.secure_url,
            ]
          : existingFestival.competate?.bgImage || [];
      } else {
        competateData.bgImage = existingFestival.competate?.bgImage || [];
      }
      updates.competate = competateData;
    }

    // Update Runway section if provided
    if (req.body.runway) {
      let runwayData = JSON.parse(req.body.runway);
      if (req.files && req.files.runwayImage && req.files.runwayImage.length) {
        const runwayFilePath = req.files.runwayImage[0].path;
        const uploadResult = await uploadOnCloudinary(runwayFilePath);
        runwayData.bgImage = uploadResult?.secure_url
          ? [
              ...(existingFestival.runway?.bgImage || []),
              uploadResult.secure_url,
            ]
          : existingFestival.runway?.bgImage || [];
      } else {
        runwayData.bgImage = existingFestival.runway?.bgImage || [];
      }
      updates.runway = runwayData;
    }

    if (req.body.cardSection) {
      const cardSectionData = JSON.parse(req.body.cardSection);
      const updatedCards = [];

      for (let i = 0; i < cardSectionData.cards.length; i++) {
        const existingCard = existingFestival.cardSection?.cards?.[i] || {};
        const fileKey = `cardImage${i}`;
        let image = existingCard.image || "";

        if (req.files?.[fileKey]?.[0]) {
          const uploaded = await uploadOnCloudinary(req.files[fileKey][0].path);
          image = uploaded?.secure_url;
        }

        updatedCards.push({
          title: cardSectionData.cards[i].title,
          description: cardSectionData.cards[i].description,
          image,
        });
      }

      updates.cardSection = {
        mainTitle: cardSectionData.mainTitle,
        cards: updatedCards,
      };
    }
    console.log("Updates object:", updates);

    const updatedFestival = await festivalSchema.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      festival: updatedFestival,
      message: "Festival page updated successfully",
    });
  } catch (error) {
    console.error("Error updating service page:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update festival page",
    });
  }
};

export const deleteFestivalImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { section, imageUrl, field } = req.body;

    const existingFestival = await festivalSchema.findById(id);
    if (!existingFestival) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    let updateQuery = {};

    if (Array.isArray(existingFestival[section]?.[field])) {
      const updatedArr = existingFestival[section][field].filter(
        (url) => url !== imageUrl,
      );
      updateQuery = { [`${section}.${field}`]: updatedArr };
    } else {
      updateQuery = { [`${section}.${field}`]: null };
    }

    const updated = await festivalSchema.findByIdAndUpdate(
      id,
      { $set: updateQuery },
      { new: true },
    );

    return res.status(200).json({ success: true, festival: updated });
  } catch (error) {
    console.error("Delete image error:", error);
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { cardIndex } = req.body;

    const festival = await festivalSchema.findById(id);
    if (!festival) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    festival.cardSection.cards.splice(cardIndex, 1);
    await festival.save();

    return res.status(200).json({
      success: true,
      festival,
      message: "Card deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};