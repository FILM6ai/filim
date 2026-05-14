import serviceSchema from "../modles/service.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createServicePage = async (req, res) => {
  try {
    const { hero, advance, toplist, robot, competate, runway } = req.body;
    const hero1 = JSON.parse(hero);
    const advance1 = JSON.parse(advance);
    const topList1 = JSON.parse(toplist);
    const robot1 = JSON.parse(robot);
    const competate1 = JSON.parse(competate);
    const runway1 = JSON.parse(runway);

    let heroVideoPath = req.files?.heroImage[0]?.path;
    let advanceImage = req.files?.advanceImage[0]?.path;
    let toplistImage = req.files?.toplistImage[0]?.path;
    let robotImage = req.files?.robotImage[0]?.path;
    let competateImage = req.files?.competateImage[0]?.path;
    let runwayImage = req.files?.runwayImage[0]?.path;

    console.log(req.files.heroImage, "heroImage");

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

    const newService = new serviceSchema({
      hero: {
        bgImage: heroVideoPath?.secure_url,
        title: hero1.title,
        alt: hero1.alt,
        description: hero1.description,
      },
      advance: {
        bgImage: advanceImage?.secure_url,
        title: advance1.title,
        title2: advance1.title2,
        description: advance1.description,
        alt: advance1.alt,
      },
      toplist: {
        bgImage: toplistImage?.secure_url,
        title: topList1.title,
        description: topList1.description,
        button: topList1.button,
        alt: topList1.alt,
        link: topList1.link,
      },
      robot: {
        bgImage: robotImage?.secure_url,
        title: robot1.title,
        description: robot1.description,
        button: robot1.button,
        alt: robot1.alt,
        link: robot1.link,
      },
      competate: {
        bgImage: competateImage?.secure_url,
        title: competate1.title,
        description: competate1.description,
        button: competate1.button,
        alt: competate1.alt,
        link: competate1.link,
      },
      runway: {
        bgImage: runwayImage?.secure_url,
        title: runway1.title,
        button: runway1.button,
        alt: runway1.alt,
        link: runway1.link,
      },
    });
    const service = await newService.save();

    res.status(200).json({
      success: true,
      service,
      message: "service page uploaded successfully",
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch service" });
  }
};

export const createGetService = async (req, res) => {
  try {
    const services = await serviceSchema.find({});
    console.log(services, "home");

    res.status(200).json({
      success: true,
      services,
      message: "service page get successfully",
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch service" });
  }
};

// update

export const updateServicePage = async (req, res) => {
  try {
    const { id } = req.params;
    const existingService = await serviceSchema.findById(id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service page not found",
      });
    }

    const updates = {};
    console.log("Raw req.body:", req.body);

    // Update Hero section if provided
    if (req.body.hero) {
      let heroData = JSON.parse(req.body.hero);
      if (req.files && req.files.heroImage && req.files.heroImage.length) {
        const heroFilePath = req.files.heroImage[0].path;
        const uploadResult = await uploadOnCloudinary(heroFilePath, {
          resource_type: "video",
        });
        heroData.bgImage = uploadResult?.secure_url;
      } else {
        // If no new image is provided, preserve the existing bgImage.
        heroData.bgImage = existingService.hero?.bgImage;
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
              ...(existingService.advance?.bgImage || []),
              uploadResult.secure_url,
            ]
          : existingService.advance?.bgImage || [];
      } else {
        advanceData.bgImage = existingService.advance?.bgImage || [];
      }
      updates.advance = advanceData;
    }

    if (req.body.toplist) {
      let toplistData = JSON.parse(req.body.toplist);
      if (
        req.files &&
        req.files.toplistImage &&
        req.files.toplistImage.length
      ) {
        const toplistFilePath = req.files.toplistImage[0].path;
        const uploadResult = await uploadOnCloudinary(toplistFilePath);
        // NAYA:
        toplistData.bgImage = uploadResult?.secure_url
          ? [
              ...(existingService.toplist?.bgImage || []),
              uploadResult.secure_url,
            ]
          : existingService.toplist?.bgImage || [];
      } else {
        toplistData.bgImage = existingService.toplist?.bgImage || [];
      }
      updates.toplist = toplistData;
    }

    // Update Robot section if provided
    if (req.body.robot) {
      let robotData = JSON.parse(req.body.robot);
      if (req.files && req.files.robotImage && req.files.robotImage.length) {
        const robotFilePath = req.files.robotImage[0].path;
        const uploadResult = await uploadOnCloudinary(robotFilePath);
        // NAYA:
        robotData.bgImage = uploadResult?.secure_url
          ? [...(existingService.robot?.bgImage || []), uploadResult.secure_url]
          : existingService.robot?.bgImage || [];
      } else {
        robotData.bgImage = existingService.robot?.bgImage || [];
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
        // NAYA:
        competateData.bgImage = uploadResult?.secure_url
          ? [
              ...(existingService.competate?.bgImage || []),
              uploadResult.secure_url,
            ]
          : existingService.competate?.bgImage || [];
      } else {
        competateData.bgImage = existingService.competate?.bgImage || [];
      }
      updates.competate = competateData;
    }

    // Update Runway section if provided
    if (req.body.runway) {
      let runwayData = JSON.parse(req.body.runway);
      if (req.files && req.files.runwayImage && req.files.runwayImage.length) {
        const runwayFilePath = req.files.runwayImage[0].path;
        const uploadResult = await uploadOnCloudinary(runwayFilePath);
        // NAYA:
        runwayData.bgImage = uploadResult?.secure_url
          ? [
              ...(existingService.runway?.bgImage || []),
              uploadResult.secure_url,
            ]
          : existingService.runway?.bgImage || [];
      } else {
        runwayData.bgImage = existingService.runway?.bgImage || [];
      }
      updates.runway = runwayData;
    }

    console.log("Updates object:", updates);

    const updatedService = await serviceSchema.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      service: updatedService,
      message: "Service page updated successfully",
    });
  } catch (error) {
    console.error("Error updating service page:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update service page",
    });
  }
};

export const deleteServiceImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { section, imageUrl, field } = req.body;

    const existingService = await serviceSchema.findById(id);
    if (!existingService) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    let updateQuery = {};

    if (Array.isArray(existingService[section]?.[field])) {
      const updatedArr = existingService[section][field].filter(
        (url) => url !== imageUrl,
      );
      updateQuery = { [`${section}.${field}`]: updatedArr };
    } else {
      updateQuery = { [`${section}.${field}`]: null };
    }

    const updated = await serviceSchema.findByIdAndUpdate(
      id,
      { $set: updateQuery },
      { new: true },
    );

    return res.status(200).json({ success: true, service: updated });
  } catch (error) {
    console.error("Delete image error:", error);
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};
