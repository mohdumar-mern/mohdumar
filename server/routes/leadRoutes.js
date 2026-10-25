
import express from "express";

import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addContactHistory,
} from "../controllers/leadController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Require authentication for every route below.
router.use(protect);

router.get("/", getLeads);
router.post("/", createLead);
router.get("/:id", getLeadById);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);
router.post("/:id/contact-history", addContactHistory);

export default router;
