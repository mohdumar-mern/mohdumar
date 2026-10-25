import express from "express";

const router = express.Router();

import authRoutes from "./authroutes.js";
import contactRoutes from "./contactRoutes.js";
import projectRoutes from "./projectRoutes.js";
import serviceRoutes from "./serviceRoutes.js";
import skillRoutes from "./skillRoutes.js";
import profileRoutes from "./profileRoutes.js";
import blogRoutes from "./blogRoutes.js";
import leadRoutes from "./leadRoutes.js";
import contractRoutes from "./contractRoutes.js";

router.use("/auth", authRoutes);
router.use("/contacts", contactRoutes);
router.use("/projects", projectRoutes);
router.use("/services", serviceRoutes);
router.use("/skills", skillRoutes);
router.use("/profile", profileRoutes);
router.use("/blogs", blogRoutes);
router.use("/leads", leadRoutes);
router.use("/contracts", contractRoutes);
export default router;
