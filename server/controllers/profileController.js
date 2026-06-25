import expressAsyncHandler from "express-async-handler";
import Profile from "../models/profileModel.js";
import path from "path";
import axios from "axios";
import { setCache, getCache, delCache } from "../utils/cache.js";
import { deleteFileFromCloudinary } from "../config/cloudinary.js";


// @desc Create Profile
// @route POST /api/profile/add
// @access Private
export const addProfile = expressAsyncHandler(async (req, res) => {
  const { name, github, linkedin, twitter, instagram, youtube } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  const avatarFile = req.files?.avatar?.[0];
  const resumeFile = req.files?.resume?.[0];

  const avatar = avatarFile
    ? {
        url: avatarFile.path || avatarFile.location || avatarFile.url,
        public_id: avatarFile.filename || avatarFile.originalname,
      }
    : null;

  const resume = resumeFile
    ? {
        url: resumeFile.path || resumeFile.location || resumeFile.url,
        public_id: resumeFile.filename || resumeFile.originalname,
      }
    : null;

  const newProfile = await Profile.create({
    name,
    avatar,
    resume,
    socialLinks: { github, linkedin, twitter, instagram, youtube },
  });

  await delCache("profile");
  res.status(201).json({ message: "Profile created successfully", data: newProfile });
});

// @desc Get Profile
// @route GET /api/profile
// @access Public
export const getProfile = expressAsyncHandler(async (req, res) => {
  const cacheKey = "profile";
  const cached = await getCache(cacheKey);
  if (cached) return res.status(200).json({ from: "cache", data: cached });

  const profile = await Profile.findOne().lean();
  if (!profile) return res.status(404).json({ message: "Profile not found" });

  await setCache(cacheKey, profile, 300);
  res.status(200).json({ from: "db", data: profile });
});

// @desc Update Profile
// @route PUT /api/profile/:id/edit
// @access Private
export const updateProfile = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, github, linkedin, twitter, instagram, youtube } = req.body;

  const profile = await Profile.findById(id);
  if (!profile) return res.status(404).json({ message: "Profile not found" });

  const avatarFile = req.files?.avatar?.[0];
  const resumeFile = req.files?.resume?.[0];

  // Cloudinary cleanup
  if (avatarFile && profile.avatar?.public_id) {
    await deleteFileFromCloudinary(profile.avatar.public_id);
  }
  if (resumeFile && profile.resume?.public_id) {
    await deleteFileFromCloudinary(profile.resume.public_id);
  }

  const updatedAvatar = avatarFile
    ? {
        url: avatarFile.path || avatarFile.location || avatarFile.url,
        public_id: avatarFile.filename || avatarFile.originalname,
      }
    : profile.avatar;

  const updatedResume = resumeFile
    ? {
        url: resumeFile.path || resumeFile.location || resumeFile.url,
        public_id: resumeFile.filename || resumeFile.originalname,
      }
    : profile.resume;

  const updatedProfile = await Profile.findByIdAndUpdate(
    id,
    {
      name: name || profile.name,
      avatar: updatedAvatar,
      resume: updatedResume,
      socialLinks: {
        github: github ?? profile.socialLinks.github,
        linkedin: linkedin ?? profile.socialLinks.linkedin,
        twitter: twitter ?? profile.socialLinks.twitter,
        instagram: instagram ?? profile.socialLinks.instagram,
        youtube: youtube ?? profile.socialLinks.youtube,
      },
    },
    { new: true, runValidators: true }
  ).lean();

  await delCache("profile");
  res.status(200).json({ message: "Profile updated successfully", data: updatedProfile });
});

// @desc Get Avatar
// @route GET /api/profile/avatar
// @access Public
export const getAvatar = expressAsyncHandler(async (req, res) => {
  const cacheKey = "avatar";
  const cached = await getCache(cacheKey);
  if (cached) return res.status(200).json({ from: "cache", avatar: cached });

  const profile = await Profile.findOne().lean();
  if (!profile?.avatar?.url) return res.status(404).json({ message: "Avatar not found" });

  const avatar = profile.avatar.url;
  await setCache(cacheKey, avatar, 300);
  res.status(200).json({ from: "db", avatar });
});

// @desc Get Resume
// @route GET /api/profile/resume
// @access Public
export const getResume = expressAsyncHandler(async (req, res) => {
  const cacheKey = "resume";
  const cached = await getCache(cacheKey);

  if (cached) {
    const fileName = path.basename(new URL(cached).pathname) || "resume.pdf";

    // Redownload from cached URL
    try {
      const fileResponse = await axios.get(cached, { responseType: "stream" });
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.setHeader("Content-Type", "application/pdf");
      return fileResponse.data.pipe(res);
    } catch (err) {
      console.warn("⚠️ Cached resume URL failed, falling back to DB...");
      await delCache(cacheKey); // invalidate broken cache
    }
  }

  const profile = await Profile.findOne().lean();
  if (!profile?.resume?.url) {
    return res.status(404).json({ message: "Resume not found" });
  }

  const fileUrl = profile.resume.url;
  const fileResponse = await axios.get(fileUrl, { responseType: "stream" });
  

  res.set({
    'Content-Disposition': 'attachment; filename="resume.pdf"',
    'Content-Type': 'application/pdf',
  });

  await setCache(cacheKey, fileUrl, 300);
    return fileResponse.data.pipe(res);
});


// @desc Get Social Links
// @route GET /api/profile/social-links
// @access Public
export const getSocialLinks = expressAsyncHandler(async (req, res) => {
  const cacheKey = "socialLinks";
  const cached = await getCache(cacheKey);
  if (cached) return res.status(200).json({ from: "cache", socialLinks: cached });

  const profile = await Profile.findOne().lean();
  if (!profile?.socialLinks) return res.status(404).json({ message: "Social Links not found" });

  await setCache(cacheKey, profile.socialLinks, 300);
  res.status(200).json({ from: "db", socialLinks: profile.socialLinks });
});
