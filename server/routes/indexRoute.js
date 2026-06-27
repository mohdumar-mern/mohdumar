import express from "express";

const router = express.Router();

import authRoutes from "./authroutes.js";
import contactRoutes from "./contactRoutes.js";
import projectRoutes from "./projectRoutes.js";
import serviceRoutes from "./serviceRoutes.js";
import skillRoutes from "./skillRoutes.js";
import profileRoutes from "./profileRoutes.js";

router.use("/auth", authRoutes);
router.use("/contacts", contactRoutes);
router.use("/projects", projectRoutes);
router.use("/services", serviceRoutes);
router.use("/skills", skillRoutes);
router.use("/profile", profileRoutes);

export default router;
