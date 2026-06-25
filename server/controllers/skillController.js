import expressAsyncHandler from "express-async-handler";
import Skill from "../models/skillModel.js";
import { delCache, getCache, setCache } from "../utils/cache.js";

// @desc   Add Single Skill
// @route  POST /api/skills/add
// @access Public
export const addSkill = expressAsyncHandler(async (req, res) => {
  const { title, level, category } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, error: "No skill image uploaded" });
  }

  const fileUrl = req.file.path || req.file.url;
  const public_id = req.file.public_id || req.file.filename || null;

  const skill = new Skill({
    title,
    level,
    category,
    file: { url: fileUrl, public_id },
  });

  const savedSkill = await skill.save();
  if (!savedSkill) return res.status(500).json({ message: "Failed to save skill" });

  await delCache("allSkills");
  res.status(201).json({ data: savedSkill });
});

// @desc   Get All Skills
// @route  GET /api/skills
// @access Public
export const getSkills = expressAsyncHandler(async (req, res) => {
  const cacheKey = "allSkills";
  const cached = await getCache(cacheKey);
  if (cached) return res.status(200).json({ from: "cache", data: cached });

  const skills = await Skill.find().lean();
  if (!skills?.length) return res.status(404).json({ message: "Skills not found" });

  await setCache(cacheKey, skills, 300);
  res.status(200).json({ from: "db", data: skills });
});

// @desc   Get Single Skill
// @route  GET /api/skills/:id/view
// @access Public
export const getSingleSkill = expressAsyncHandler(async (req, res) => {
  const cacheKey = `skill:${req.params.id}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.status(200).json({ from: "cache", data: cached });

  const skill = await Skill.findById(req.params.id).lean();
  if (!skill) return res.status(404).json({ message: "Skill not found" });

  await setCache(cacheKey, skill, 300);
  res.status(200).json({ from: "db", data: skill });
});

// @desc   Update Skill
// @route  PUT /api/skills/:id/edit
// @access Public
export const updateSkill = expressAsyncHandler(async (req, res) => {
  const { title, level, category } = req.body;
  const skill = await Skill.findById(req.params.id);
  if (!skill) return res.status(404).json({ message: "Skill not found" });

  let fileUrl = skill.file?.url || "";
  let public_id = skill.file?.public_id || "";

  if (req.file) {
    fileUrl = req.file.path || req.file.url || fileUrl;
    public_id = req.file.public_id || req.file.filename || public_id;
  }

  const updatedSkill = await Skill.findByIdAndUpdate(
    req.params.id,
    {
      title: title || skill.title,
      level: level || skill.level,
      category: category || skill.category,
      file: { url: fileUrl, public_id },
    },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedSkill) return res.status(400).json({ message: "Failed to update skill" });

  await delCache("allSkills");
  await delCache(`skill:${req.params.id}`);
  res.status(200).json({ data: updatedSkill });
});

// @desc   Delete Skill
// @route  DELETE /api/skills/:id
// @access Public
export const deleteSkill = expressAsyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id).lean();
  if (!skill) return res.status(404).json({ message: "Skill not found" });

  await delCache("allSkills");
  await delCache(`skill:${req.params.id}`);
  res.status(200).json({ message: "Skill deleted successfully" });
});
