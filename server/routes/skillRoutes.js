import express from "express";
const router = express.Router();

import upload from "../middlewares/multerMiddleware.js";
import {
  getSkills,
  getSingleSkill,
  addSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";

// GET all skills
router.get("/", getSkills);

// GET single skill by ID
router.get("/:id/view", getSingleSkill);

// POST add new skill (uses "file" as the form field name for multer)
router.post("/add", upload.single("file"), addSkill);

// PUT update skill (uses "file" as the field name to match controller)
router.put("/:id/edit", upload.single("file"), updateSkill);

// DELETE skill
router.delete("/:id", deleteSkill);

export default router;
