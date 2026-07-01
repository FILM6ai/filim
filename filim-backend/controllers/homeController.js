import homeSchema from "../modles/home.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createHomePage = async (req, res) => {
  try {
    const { hero, advance, toplist, robot, competate, runway, videos } = req.body;

    const parseField = (value) => {
      if (!value) return {};
      if (typeof value === 'object') return value;
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    };

    
    const hero1 = parseField(hero);
    const advance1 = parseField(advance);
    const topList1 = parseField(toplist);
    const robot1 = parseField(robot);
    const competate1 = parseField(competate);
    const runway1 = parseField(runway);
    const videos1 = parseField(videos);

    const heroVideoPaths = req.files?.heroImage?.map((file) => file.path) || [];

    const uploadedVideos = heroVideoPaths.length
      ? (
          await Promise.all(
            heroVideoPaths.map((path) =>
              uploadOnCloudinary(path, { resource_type: "video" }),
            ),
          )
        ).filter(Boolean)
      : [];

    const videoPlayerPath = req.files?.videoPlayer?.[0]?.path;
    let advanceImage = req.files?.advanceImage?.[0]?.path;
    let toplistImage = req.files?.toplistImage?.[0]?.path;
    let robotImage = req.files?.robotImage?.[0]?.path;
    let competateImage = req.files?.competateImage?.[0]?.path;
    let runwayImage = req.files?.runwayImage?.[0]?.path;

    console.log(req.files?.heroImage, "heroImage");

    let uploadedVideoUrls = [];
    if (req.files?.videoPlayer && req.files.videoPlayer.length > 0) {
      const paths = req.files.videoPlayer.map(f => f.path);
      const uploaded = await Promise.all(
        paths.map(p => uploadOnCloudinary(p, { resource_type: "video" }))
      );
      uploadedVideoUrls = uploaded.map(v => v.secure_url);
    }
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

    const heroBgImages = [
      ...uploadedVideos.map((v) => v?.secure_url).filter(Boolean),
      ...(hero1.youtubeUrls || []),
    ];

    const newHome = new homeSchema({
      hero: {
        bgImage: heroBgImages,
        title: hero1.title,
        description: hero1.description,
        button: hero1.buttonText,
        alt: hero1.alt,
        link: hero1.link,
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
      videos: {
        title: videos1.title,
        description: videos1.description,
        videoUrls: uploadedVideoUrls,                    // array of uploaded video URLs
        youtubeUrl: videos1.youtubeUrl || "",            // YouTube embed URL
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
      runway: {
        alt: runway1.alt,
        bgImage: runwayImage?.secure_url,
        title: runway1.title,
        button: runway1.button,
        link: runway1.link,
      },
    });
    const home = await newHome.save();
    res.status(200).json({
      success: true,
      home,
      message: "home page uploaded successfully",
    });
  } catch (error) {
    console.error("Error fetching HomePage:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch HomePage" });
  }
};

export const createGetHome = async (req, res) => {
  try {
    const home = await homeSchema.find({});
    console.log(home, "home");

    res.status(200).json({
      success: true,
      home,
      message: "home page get successfully",
    });
  } catch (error) {
    console.error("Error fetching HomePage:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch HomePage" });
  }
};

export const updateHomePage = async (req, res) => {
  try {
    const { id } = req.params;
    const existingHome = await homeSchema.findById(id);
    if (!existingHome) {
      return res.status(404).json({
        success: false,
        message: "Home page not found",
      });
    }

    const updates = {};
    const parseField = (value) => {
      if (!value) return {};
      if (typeof value === 'object') return value;
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    };

    console.log("Raw req.body:", req.body);

    if (req.body.hero) {
      let heroData = parseField(req.body.hero);
      const existingImages = existingHome.hero?.bgImage || [];

      let newUploadedUrls = [];
      if (req.files && req.files.heroImage && req.files.heroImage.length) {
        const heroVideoPath = req.files.heroImage.map((file) => file.path);
        const uploadedVideos = await Promise.all(
          heroVideoPath.map((path) =>
            uploadOnCloudinary(path, { resource_type: "video" }),
          ),
        );
        newUploadedUrls = uploadedVideos.map((v) => v.secure_url);
      }

      const newYoutubeUrls = heroData.newYoutubeUrls || [];
      heroData.bgImage = [...newUploadedUrls, ...newYoutubeUrls, ...existingImages];
      delete heroData.newYoutubeUrls;
      updates.hero = heroData;
    }
    console.log(req.files, "req.files");

    if (req.body.videos) {
      let videosData = parseField(req.body.videos);

      // Uploaded video files handle karo
      let newUploadedUrls = [];
      if (req.files?.videoPlayer && req.files.videoPlayer.length > 0) {
        const paths = req.files.videoPlayer.map(f => f.path);
        const uploaded = await Promise.all(
          paths.map(p => uploadOnCloudinary(p, { resource_type: "video" }))
        );
        newUploadedUrls = uploaded.map(v => v.secure_url);
      }

      // Existing video URLs ke saath merge karo
      const existingVideoUrls = Array.isArray(existingHome.videos?.videoUrls)
        ? existingHome.videos.videoUrls
        : existingHome.videos?.videoUrls
          ? [existingHome.videos.videoUrls]
          : [];

      videosData.videoUrls = [...existingVideoUrls, ...newUploadedUrls];

      videosData.youtubeUrl = videosData.youtubeUrl && videosData.youtubeUrl.trim() !== ""
        ? videosData.youtubeUrl
        : existingHome.videos?.youtubeUrl ?? "";

      updates.videos = videosData;
    }

    if (req.body.advance) {
      let advanceData = parseField(req.body.advance);
      if (
        req.files &&
        req.files.advanceImage &&
        req.files.advanceImage.length
      ) {
        const advanceFilePath = req.files.advanceImage[0].path;
        const uploadResult = await uploadOnCloudinary(advanceFilePath);
        const existingAdvance = existingHome.advance?.bgImage || [];
        advanceData.bgImage = [...existingAdvance, uploadResult?.secure_url];
      } else {
        advanceData.bgImage = existingHome.advance?.bgImage || [];
      }
      updates.advance = advanceData;
    }

    // Update Toplist section if provided
    if (req.body.toplist) {
      let toplistData = parseField(req.body.toplist);
      if (
        req.files &&
        req.files.toplistImage &&
        req.files.toplistImage.length
      ) {
        const toplistFilePath = req.files.toplistImage[0].path;
        const uploadResult = await uploadOnCloudinary(toplistFilePath);
        const existingToplist = existingHome.toplist?.bgImage || [];
        toplistData.bgImage = [...existingToplist, uploadResult?.secure_url];
      } else {
        toplistData.bgImage = existingHome.toplist?.bgImage || [];
      }
      updates.toplist = toplistData;
    }

    // Update Robot section if provided
    if (req.body.robot) {
      let robotData = parseField(req.body.robot);
      if (req.files && req.files.robotImage && req.files.robotImage.length) {
        const robotFilePath = req.files.robotImage[0].path;
        const uploadResult = await uploadOnCloudinary(robotFilePath);
        const existingRobot = existingHome.robot?.bgImage || [];
        robotData.bgImage = [...existingRobot, uploadResult?.secure_url];
      } else {
        robotData.bgImage = existingHome.robot?.bgImage || [];
      }
      updates.robot = robotData;
    }

    // Update Competate section if provided
    if (req.body.competate) {
      let competateData = parseField(req.body.competate);
      if (
        req.files &&
        req.files.competateImage &&
        req.files.competateImage.length
      ) {
        const competateFilePath = req.files.competateImage[0].path;
        const uploadResult = await uploadOnCloudinary(competateFilePath);
        const existingCompetate = existingHome.competate?.bgImage || [];
        competateData.bgImage = [
          ...existingCompetate,
          uploadResult?.secure_url,
        ];
      } else {
        competateData.bgImage = existingHome.competate?.bgImage || [];
      }
      updates.competate = competateData;
    }

    // Update Runway section if provided
    if (req.body.runway) {
      let runwayData = parseField(req.body.runway);
      if (req.files && req.files.runwayImage && req.files.runwayImage.length) {
        const runwayFilePath = req.files.runwayImage[0].path;
        const uploadResult = await uploadOnCloudinary(runwayFilePath);
        const existingRunway = existingHome.runway?.bgImage || [];
        runwayData.bgImage = [...existingRunway, uploadResult?.secure_url];
      } else {
        runwayData.bgImage = existingHome.runway?.bgImage || [];
      }
      updates.runway = runwayData;
    }

    console.log("Updates object:", updates);

    const updatedHome = await homeSchema.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      home: updatedHome,
      message: "Home page updated successfully",
    });
  } catch (error) {
    console.error("Error updating home page:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update home page",
      error: error.message || "Unknown error",
    });
  }
};

export const deleteHomeImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { section, imageUrl, field } = req.body;
    const existingHome = await homeSchema.findById(id);
    if (!existingHome) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    let updateQuery = {};

    if (Array.isArray(existingHome[section]?.[field])) {
      const updatedArr = existingHome[section][field].filter(
        (url) => url !== imageUrl,
      );
      updateQuery = { [`${section}.${field}`]: updatedArr };
    } else {
      updateQuery = { [`${section}.${field}`]: "" };
    }

    const updated = await homeSchema.findByIdAndUpdate(
      id,
      { $set: updateQuery },
      { new: true },
    );

    return res.status(200).json({ success: true, home: updated });
  } catch (error) {
    console.error("Delete image error:", error);
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};
